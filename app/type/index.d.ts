export interface IPaged<T> {
  data: T;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface Paged<T> {
  data: T;
  totalItems: number;
}
