import api from "@/api/lib";
import type { Author } from "@/api/lib/types";

export function getAll() {
  return api.get<Author[]>("authors");
}
