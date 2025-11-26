// Vitest setup file for React + RTL
import "@testing-library/jest-dom";

// Robust matchMedia mock for all tests (override any existing impl from jsdom)
// This ensures window.matchMedia is always a function with add/removeEventListener APIs.
Object.defineProperty(window, "matchMedia", {
  writable: true,

  value: (() => {
    const registry = new Map<string, MediaQueryList>();
    return (query: string) => {
      const existing = registry.get(query);
      if (existing) return existing;

      let matches = false;
      const listeners = new Set<EventListenerOrEventListenerObject>();
      const mql: MediaQueryList = {
        matches,
        media: query,
        onchange: null,
        // legacy API used by some libs
        addListener: (listener: (event: Event) => void) =>
          listeners.add(listener),
        removeListener: (listener: (event: Event) => void) =>
          listeners.delete(listener),
        addEventListener: (
          _0: string,
          listener: EventListenerOrEventListenerObject,
        ) => listeners.add(listener),
        removeEventListener: (
          _0: string,
          listener: EventListenerOrEventListenerObject,
        ) => listeners.delete(listener),
        dispatchEvent: (event: Event) => {
          if (event.type === "change") {
            const mediaQueryListEvent = event as MediaQueryListEvent;
            matches = mediaQueryListEvent.matches;
            // reflect internal matches state
            Object.defineProperty(mql, "matches", { value: matches });
            listeners.forEach((listener) =>
              typeof listener === "function"
                ? listener(mediaQueryListEvent)
                : listener.handleEvent(mediaQueryListEvent),
            );
          }
          return true;
        },
      } satisfies MediaQueryList;
      registry.set(query, mql);
      return mql;
    };
  })(),
});

// Ensure document has an html element attribute API applied during tests
document.documentElement.setAttribute("data-bs-theme", "light");

// Override global Request to support relative URLs in tests
const RELATIVE_FETCH_BASE_URL = "http://localhost";
const OriginalRequest = globalThis.Request;
if (OriginalRequest !== undefined) {
  class RelativeRequest extends OriginalRequest {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      const normalizedInput =
        typeof input === "string" && input.startsWith("/")
          ? new URL(input, RELATIVE_FETCH_BASE_URL)
          : input instanceof URL && input.href.startsWith("/")
            ? new URL(input.href, RELATIVE_FETCH_BASE_URL)
            : input;
      super(normalizedInput as RequestInfo | URL, init);
    }
  }

  globalThis.Request = RelativeRequest as typeof Request;
}
