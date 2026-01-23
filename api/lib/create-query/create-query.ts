import type { BulkParams, SortParams } from "./types";

export default function createQuery<T>(params: BulkParams<T>): string {
  let query = "";

  if(params.search) query += `q=${params.search}`;

  let sort = "";

  if(params.sort) {
    const keys = Object.keys(params.sort);
    const values = Object.values<SortParams<T>[keyof T]>(params.sort);
    
    if(keys.length && values.length) {
      sort += `_sort=${keys.join(",")}`;
      sort += "&";
      sort += `_order=${values.map(v => v === 1 ? "asc" : "desc").join(",")}`;
    }
  }

  if(sort) query += `${query && "&"}${sort}`;

  return query;
}
