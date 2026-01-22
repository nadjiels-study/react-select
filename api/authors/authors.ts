import api from "@/api";
import type { Author } from "@/api/types";

export function getAll() {
  return api.get<Author[]>("authors");
}
