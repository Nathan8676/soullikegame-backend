export function assertSoftDefined<T>(value: T | undefined | null, message?: string): T | null {
  if (value === undefined || value === null) {
    console.error(message ?? "value was undefined or null")
    return null
  }
  return value
}

export function mustHave<T>(value: T | undefined | null, message?: string): T {
  if (value === undefined || value === null) {
    throw new Error(message ?? "value was undefined or null")
  }
  return value
}
