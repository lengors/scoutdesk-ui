export type HttpStream<TOutput> = AsyncGenerator<
  { value: TOutput } | { error: unknown },
  void,
  unknown
>;
