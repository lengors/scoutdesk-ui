export type HttpResponseParser<TOutput> =
  | ((response: unknown) => TOutput | Promise<TOutput>)
  | {
      readonly parse: (response: unknown) => TOutput;
    }
  | {
      readonly parseAsync: (response: unknown) => Promise<TOutput>;
    };
