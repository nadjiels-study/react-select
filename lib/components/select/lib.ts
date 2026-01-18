import type { DefaultOption } from "./types";

export function createOption(
  label: string,
  value?: string
): DefaultOption {
  return {
    label,
    value: value ?? label.trim().toLowerCase(),
  }
}
