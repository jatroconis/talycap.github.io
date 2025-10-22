export interface Page<T> {
  page: number;
  totalPages: number;
  total: number;
  items: T[];
}
