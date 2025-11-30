import type { FieldError } from "react-hook-form";

export type FieldErrorTree = FieldError & {
  readonly [key: string]: FieldErrorTree | undefined;
};

export function flattenFieldErrorTree(
  { message, type, types, ref: _0, root: _1, ...properties }: FieldErrorTree,
  prefix?: string,
) {
  const output: (readonly [string] | readonly [string, string])[] = [];
  if (message !== undefined) {
    output.push((type?.trim()?.length ?? 0) > 0 ? [message, type] : [message]);
  }

  output.push(
    ...Object.entries(types ?? {}).flatMap(([, value]) => {
      if (value === undefined) {
        return [];
      }

      return Array.isArray(value)
        ? value.map((message) => [message] as const)
        : [[`${value}`] as const];
    }),
  );

  output.push(
    ...Object.entries(properties).flatMap(([key, value]) =>
      value !== undefined ? flattenFieldErrorTree(value, key) : [],
    ),
  );

  return output.map((entry) => {
    if (prefix === undefined || prefix.trim().length === 0) {
      return entry;
    }

    const [message, type] = entry;
    return [
      message,
      type === undefined ? prefix : `${prefix}.${type}`,
    ] as const;
  });
}
