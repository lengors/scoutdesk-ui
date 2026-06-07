export class SortedSet<TValue extends NonNullable<unknown> | null>
  implements Iterable<TValue>
{
  readonly #array: TValue[] = [];
  readonly #comparator: (left: TValue, right: TValue) => number;

  constructor(comparator: (left: TValue, right: TValue) => number) {
    this.#comparator = comparator;
  }

  [Symbol.iterator](): Iterator<TValue> {
    return this.#array[Symbol.iterator]();
  }

  at(index: number): TValue | undefined {
    return this.#array[index];
  }

  clear(): void {
    this.#array.splice(0, this.#array.length);
  }

  insert(...items: ReadonlyArray<TValue>): void {
    this.insertAll(items);
  }

  insertAll(items: Iterable<TValue>): void {
    let low: number = 0;
    const iterator = items[Symbol.iterator]();

    let element = iterator.next();
    if (element.done) {
      return;
    }

    while (true) {
      const current = element.value;

      let high = this.#array.length;
      while (low < high) {
        const mid = (low + high) >>> 1;
        const midValue = this.#array[mid]!;
        if (this.#comparator(midValue, current) < 0) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }

      const existing = this.#array[low];
      const added: boolean =
        existing === undefined || this.#comparator(existing, current) !== 0;
      if (added) {
        this.#array.splice(low, 0, current);
      }

      element = iterator.next();
      if (element.done) {
        return;
      }

      const comparison = this.#comparator(current, element.value);
      if (comparison > 0) {
        low = 0;
      } else if (added && comparison < 0) {
        ++low;
      }
    }
  }

  remove(...items: ReadonlyArray<TValue>): void {
    this.removeAll(items);
  }

  removeAll(items: Iterable<TValue>): void {
    let low: number = 0;
    const iterator = items[Symbol.iterator]();

    let element = iterator.next();
    if (element.done) {
      return;
    }

    while (true) {
      const current = element.value;

      let high = this.#array.length;
      while (low < high) {
        const mid = (low + high) >>> 1;
        const midValue = this.#array[mid]!;
        const comparison = this.#comparator(midValue, current);

        if (comparison < 0) {
          low = mid + 1;
        } else if (comparison > 0) {
          high = mid;
        } else {
          this.#array.splice((low = mid), 1);
          break;
        }
      }

      element = iterator.next();
      if (element.done) {
        return;
      } else if (this.#comparator(current, element.value) > 0) {
        low = 0;
      }
    }
  }

  get size(): number {
    return this.#array.length;
  }

  slice(
    start: number = 0,
    end: number = this.#array.length,
  ): ReadonlyArray<TValue> {
    return start > end
      ? this.#array.slice(end + 1, start + 1).reverse()
      : this.#array.slice(start, end);
  }
}
