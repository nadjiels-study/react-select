import type { BulkParams } from "./types";

export default function createQuery(params: BulkParams): string {
  let query = "";

  if(params.search) query += `q=${params.search}`;

  return query;
}
