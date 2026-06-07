import { beforeEach } from "vitest";

class MockMediaQueryList implements MediaQueryList {
  static readonly #registry = new Map<string, MockMediaQueryList>();

  readonly #listeners = new Set<EventListenerOrEventListenerObject>();
  readonly #query: string;

  #matches: boolean;

  constructor(query: string, matches: boolean = false) {
    this.#matches = matches;
    this.#query = query;
  }

  addEventListener(
    _0: unknown,
    listener: EventListenerOrEventListenerObject,
    _1?: unknown,
  ): void {
    this.#listeners.add(listener as EventListenerOrEventListenerObject);
  }

  addListener(listener: (event: Event) => void): void {
    this.#listeners.add(listener);
  }

  dispatchEvent(event: Event): boolean {
    if (
      event.type === "change" &&
      "matches" in event &&
      typeof event.matches === "boolean"
    ) {
      this.#matches = event.matches;
      this.#listeners.forEach((listener) =>
        typeof listener === "function"
          ? listener(event)
          : listener.handleEvent(event),
      );
    }
    return true;
  }

  get matches(): boolean {
    return this.#matches;
  }

  get media(): string {
    return this.#query;
  }

  get onchange(): null {
    return null;
  }

  removeEventListener(
    _0: unknown,
    listener: EventListenerOrEventListenerObject,
    _1?: unknown,
  ): void {
    this.#listeners.delete(listener as EventListenerOrEventListenerObject);
  }

  removeListener(listener: (event: Event) => void): void {
    this.#listeners.delete(listener);
  }

  static cleanup() {
    this.#registry.clear();
  }

  static getOrCreate(query: string): MediaQueryList {
    let instance = this.#registry.get(query);
    if (instance !== undefined) {
      return instance;
    }

    instance = new MockMediaQueryList(query);
    this.#registry.set(query, instance);
    return instance;
  }
}

Object.defineProperty(window, "matchMedia", {
  value: (query: string) => MockMediaQueryList.getOrCreate(query),
  writable: true,
});

beforeEach(() => MockMediaQueryList.cleanup());
