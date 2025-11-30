export const NotFoundRoute = {
  UNKNOWN: ((): typeof unknown => {
    const unknown: unique symbol = Symbol();
    return unknown as typeof unknown;
  })(),
  SPECIFICATIONS: "specifications",
} as const;

export type NotFoundRoute = (typeof NotFoundRoute)[keyof typeof NotFoundRoute];
