import type { ScraperSnapshot } from "./scraper-snapshot";
import type { Identifiable } from "../../models/common/identifiable";
import type { ScraperEntry } from "../../models/scrapers/scraper-entry";

import { SortedSet } from "../../collections/sorted-set";
import { SortedMap } from "../../collections/sorted-map";
import { scraperPriceSorter } from "./scraper-price-sorter";

export class ScraperStateManager {
  readonly #accumulator = new SortedSet(scraperPriceSorter);
  readonly #entries = new SortedSet(scraperPriceSorter);
  readonly #hidden = new SortedSet(scraperPriceSorter);
  readonly #brands = new SortedMap<string, boolean>((left, right) =>
    left.localeCompare(right),
  );
  readonly #listeners: (() => void)[] = [];
  readonly #initialBatchSize: number;

  #snapshot: ScraperSnapshot;
  #pendingFrame?: number;

  constructor(batchSize: number = 1) {
    this.#initialBatchSize = batchSize;
    this.#snapshot = {
      batch: [],
      batchOffset: 0,
      batchSize,
      brands: [],
      count: 0,
      direction: "forward",
      selectionMode: "all",
    };
  }

  setBatchOffset(offset: number) {
    if (this.#snapshot.batchOffset === offset) {
      return;
    }

    const [startIndex, endIndex] = this.#indices({ offset });
    this.#dispatch({
      batch: this.#entries.slice(startIndex, endIndex),
      batchOffset: offset,
    } satisfies Partial<ScraperSnapshot>);
  }

  setBatchSize(size: number) {
    if (this.#snapshot.batchSize === size) {
      return;
    }

    const [startIndex, endIndex] = this.#indices({ size });
    this.#dispatch({
      batch: this.#entries.slice(startIndex, endIndex),
      batchSize: size,
    } satisfies Partial<ScraperSnapshot>);
  }

  flush() {
    const processingEntries = Object.groupBy(this.#accumulator, (entry) =>
      entry.brand.description.toLowerCase(),
    );
    this.#accumulator.clear();

    let updatedBrands = false;
    const select = this.#snapshot.selectionMode === "all";
    const selectedEntries: Identifiable<ScraperEntry, number>[] = [];
    const unselectedEntries: Identifiable<ScraperEntry, number>[] = [];
    for (const [brand, entries] of Object.entries(processingEntries)) {
      let selected = this.#brands.get(brand);
      if (selected === undefined) {
        this.#brands.set(brand, (selected = select));
        updatedBrands = true;
      }

      if (entries === undefined) {
        continue;
      }

      if (selected) {
        selectedEntries.push(...entries);
      } else {
        unselectedEntries.push(...entries);
      }
    }

    const direction = this.#snapshot.direction === "forward" ? 1 : -1;
    const [startIndex, endIndex] = this.#indices();
    const start = this.#entries.at(startIndex);
    const end = this.#entries.at(endIndex - direction);

    this.#entries.insertAll(selectedEntries.toSorted(scraperPriceSorter));
    this.#hidden.insertAll(unselectedEntries.toSorted(scraperPriceSorter));

    const [newStartIndex, newEndIndex] = this.#indices();
    const newStart = this.#entries.at(newStartIndex);
    const newEnd = this.#entries.at(newEndIndex - direction);

    // Dispatch snapshot update
    const updatedSnapshot: Partial<ScraperSnapshot> = Object.assign(
      (start !== newStart || end !== newEnd
        ? { batch: this.#entries.slice(newStartIndex, newEndIndex) }
        : {}) satisfies Partial<ScraperSnapshot>,
      (updatedBrands
        ? { brands: [...this.#brands] }
        : {}) satisfies Partial<ScraperSnapshot>,
      (selectedEntries.length > 0
        ? { count: this.#entries.size }
        : {}) satisfies Partial<ScraperSnapshot>,
    );

    if (
      updatedSnapshot.batch !== undefined ||
      updatedSnapshot.brands !== undefined ||
      updatedSnapshot.count !== undefined
    ) {
      this.#dispatchAsync(updatedSnapshot);
    }
  }

  insert(entry: Identifiable<ScraperEntry, number>): this {
    this.#accumulator.insert(entry);

    if (this.#accumulator.size >= this.#snapshot.batchSize) {
      this.flush();
    }

    return this;
  }

  reset() {
    this.#accumulator.clear();
    this.#entries.clear();
    this.#hidden.clear();
    this.#brands.clear();

    // Dispatch snapshot update
    this.#dispatch({
      batch: [],
      batchOffset: 0,
      batchSize: this.#initialBatchSize,
      brands: [],
      count: 0,
      direction: "forward",
      selectionMode: "all",
    } satisfies Partial<ScraperSnapshot>);
  }

  selectAll(mode: "all" | "none") {
    if (this.#snapshot.selectionMode === mode) {
      return;
    }

    const select = mode === "all";
    const updatedBrands: Set<string> = new Set();
    for (const [brand, selected] of this.#brands) {
      if (selected !== select) {
        this.#brands.set(brand, select);
        updatedBrands.add(brand);
      }
    }

    if (updatedBrands.size === 0) {
      // Dispatch snapshot update
      this.#dispatch({
        selectionMode: mode,
      } satisfies Partial<ScraperSnapshot>);
      return;
    }

    const [source, target] = select
      ? [this.#hidden, this.#entries]
      : [this.#entries, this.#hidden];

    target.insertAll(source);
    source.clear();

    const [startIndex, endIndex] = this.#indices();
    this.#dispatch({
      batch: this.#entries.slice(startIndex, endIndex),
      brands: [...this.#brands],
      count: this.#entries.size,
      selectionMode: mode,
    } satisfies Partial<ScraperSnapshot>);
  }

  get size(): number {
    return this.#entries.size + this.#hidden.size + this.#accumulator.size;
  }

  get snapshot() {
    return this.#snapshot;
  }

  sort(sorter: "price.asc" | "price.desc") {
    let direction: "forward" | "backward";
    switch (sorter) {
      case "price.asc":
        direction = "forward";
        break;

      case "price.desc":
        direction = "backward";
        break;

      default:
        ((_: never): never => {
          throw new Error("This code path should be unreachable");
        })(sorter);
    }

    if (this.#snapshot.direction === direction) {
      return;
    }

    const [startIndex, endIndex] = this.#indices({ direction });
    this.#dispatch({
      batch: this.#entries.slice(startIndex, endIndex),
      direction,
    } satisfies Partial<ScraperSnapshot>);
  }

  subscribe(listener: () => void): () => void {
    this.#listeners.push(listener);
    return () => {
      let index = this.#listeners.indexOf(listener);
      while (index !== -1) {
        this.#listeners.splice(index, 1);
        index = this.#listeners.indexOf(listener, index);
      }
    };
  }

  toggleBrand(brand: string, value?: boolean) {
    const key = brand.toLowerCase();
    const selected = this.#brands.get(key);
    if (value !== undefined && selected === value) {
      return false;
    }

    this.#brands.set(key, value ?? !selected);

    const [source, target] = value
      ? [this.#hidden, this.#entries]
      : [this.#entries, this.#hidden];
    const updatedEntries: Identifiable<ScraperEntry, number>[] = [];
    for (const entry of source) {
      if (entry.brand.description.toLowerCase() === key) {
        updatedEntries.push(entry);
      }
    }

    target.insertAll(updatedEntries);
    source.removeAll(updatedEntries);

    // Dispatch snapshot update
    const [startIndex, endIndex] = this.#indices();
    this.#dispatch(
      Object.assign(
        {
          brands: [...this.#brands],
          selectionMode: "indeterminate",
        } as const satisfies Partial<ScraperSnapshot>,
        (updatedEntries.length > 0
          ? {
              batch: this.#entries.slice(startIndex, endIndex),
              count: this.#entries.size,
            }
          : {}) satisfies Partial<ScraperSnapshot>,
      ),
    );
  }

  #dispatch(snapshot: Partial<ScraperSnapshot>) {
    this.#snapshot = { ...this.#snapshot, ...snapshot };
    if (this.#pendingFrame !== undefined) {
      cancelAnimationFrame(this.#pendingFrame);
      this.#pendingFrame = undefined;
    }

    for (const listener of this.#listeners) {
      listener();
    }
  }

  #dispatchAsync(snapshot: Partial<ScraperSnapshot>) {
    this.#snapshot = { ...this.#snapshot, ...snapshot };
    if (this.#pendingFrame !== undefined) {
      return;
    }

    this.#pendingFrame = requestAnimationFrame(() => {
      this.#pendingFrame = undefined;
      for (const listener of this.#listeners) {
        listener();
      }
    });
  }

  #indices({
    direction = this.#snapshot.direction,
    offset = this.#snapshot.batchOffset,
    size = this.#snapshot.batchSize,
  }: {
    readonly direction?: "forward" | "backward";
    readonly offset?: number;
    readonly size?: number;
  } = {}) {
    const length = this.#entries.size;
    const adjustedOffset = Math.min(
      Math.floor(length / size) - Number(length % size === 0),
      Math.max(0, offset),
    );
    let startIndex: number, endIndex: number;
    if (direction === "forward") {
      startIndex = adjustedOffset * size;
      endIndex = Math.min(length, startIndex + size);
    } else {
      startIndex = length - 1 - adjustedOffset * size;
      endIndex = Math.max(-1, startIndex - size);
    }
    return [startIndex, endIndex] as const;
  }
}
