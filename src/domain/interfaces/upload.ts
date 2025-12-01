import {
  PaginationRequest,
  PaginationResponse,
} from '@/utils/pagination/paginate';

export type UploadModel = {
  id: string;
  filename: string;
  mimetype: string;
  path: string;
  userId: string;
  size: number | null;

  createdAt: Date;
  updatedAt: Date;
};

export type AddUploadModel = Omit<
  UploadModel,
  'id' | 'createdAt' | 'updatedAt'
>;

type UploadFiltersModel = {
  userId?: string;
};

type UploadOrderByModel = {
  createdAt?: 'asc' | 'desc';
  updatedAt?: 'asc' | 'desc';
};

export type UploadPaginationRequest = PaginationRequest<
  UploadFiltersModel,
  UploadOrderByModel
>;

export type UploadPaginationResponse = PaginationResponse<UploadModel>;
