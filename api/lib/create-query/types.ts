export type SortParams<T> = Partial<Record<keyof T, 1 | -1>>;

export interface BulkParams<T> {
  search?: string;
  sort?: SortParams<T>;
}
