import api from "@/api/lib";
import createQuery from "@/api/lib/create-query";
import type { Author } from "@/api/lib/types";
import type { BulkParams } from "@/api/lib/create-query/types";

export function getAll(params?: BulkParams) {
  const query = params ? createQuery(params) : "";
  
  return api.get<Author[]>(`authors?_limit=10${query && "&" + query}`);
}
