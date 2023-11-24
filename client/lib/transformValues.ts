export const transformValues = <
  T extends Record<string, unknown>,
  R extends { [K in keyof T]: unknown }
>(
  obj: T,
  transformValue: (value: T[keyof T]) => R[keyof T]
): R =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      transformValue(value as T[keyof T]),
    ])
  ) as R;
