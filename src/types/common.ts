export interface PaginatedData<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: PaginatedData<T>;
  errors?: unknown;
}
