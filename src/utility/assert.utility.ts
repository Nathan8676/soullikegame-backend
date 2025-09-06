import ApiErrors from "./apiError.utility"

export function assertSoftDefined<T>(value: T | undefined | null, message?: string): T | null {
  if (value === undefined || value === null) {
    console.error(message ?? "value was undefined or null")
    return null
  }
  return value
}

export function mustHave<T>(value: T | undefined | null, message?: string, StatusCode?: number): T {
  if (value === undefined || value === null) {
    throw new ApiErrors(StatusCode ?? 500, message ?? "value was undefined or null")
  }
  if (typeof value === "string") {
    const trimmed = value.trim() as T
    if (trimmed === "") {
      throw new ApiErrors(StatusCode ?? 500, message ?? "value is an emty string")
    }
    return trimmed
  }
  if (Array.isArray(value)) {
    for (const v in value) {
      value[v] = mustHave(v, message, StatusCode)
    }
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    for (const v in value) {
      value[v] = mustHave(value[v], `${v}: ${message ?? "is null or undefined"}`, StatusCode)
    }
  }

  return value
}

