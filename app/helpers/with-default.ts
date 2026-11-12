export default function withDefault<T, D>(
  value: T | null | undefined,
  defaultValue: D,
): T | D {
  return value ?? defaultValue;
}
