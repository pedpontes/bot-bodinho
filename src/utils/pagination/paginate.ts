export type PaginationRequest<T = unknown, K = unknown> = {
  filters?: T;
  orderBy?: K;
  page?: number;
  limit?: number;
  search?: string;
};

export type PaginationResponse<T = unknown, K = { total: number }> = {
  data: T[];
  page: number;
  limit: number;
  count: K;
};
