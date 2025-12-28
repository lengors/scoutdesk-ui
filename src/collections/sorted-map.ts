export class SortedMap<TKey extends NonNullable<unknown> | null, TValue>
  implements Iterable<[TKey, TValue]>
{
  readonly #array: [TKey, TValue][] = [];
  readonly #comparator: (left: TKey, right: TKey) => number;

  constructor(comparator: (left: TKey, right: TKey) => number) {
    this.#comparator = comparator;
  }

  [Symbol.iterator](): Iterator<[TKey, TValue]> {
    return this.#array[Symbol.iterator]();
  }

  clear(): void {
    this.#array.splice(0, this.#array.length);
  }

  get(key: TKey): TValue | undefined {
    let low: number = 0;

    let high = this.#array.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      const [midKey, midValue] = this.#array[mid]!;
      const comparison = this.#comparator(midKey, key);

      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid;
      } else {
        return midValue;
      }
    }

    return undefined;
  }

  set(key: TKey, value: TValue): void {
    let low: number = 0;

    let high = this.#array.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      const [midKey] = this.#array[mid]!;
      const comparison = this.#comparator(midKey, key);
      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid;
      } else {
        this.#array[mid] = [key, value];
        return;
      }
    }

    this.#array.splice(low, 0, [key, value]);
  }

  get size(): number {
    return this.#array.length;
  }

  remove(key: TKey): void {
    let low: number = 0;

    let high = this.#array.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      const [midKey] = this.#array[mid]!;
      const comparison = this.#comparator(midKey, key);
      if (comparison < 0) {
        low = mid + 1;
      } else if (comparison > 0) {
        high = mid;
      } else {
        this.#array.splice(mid, 1);
        return;
      }
    }
  }
}
