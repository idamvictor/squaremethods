export interface File {
  key: string;
  name: string;
  url: string;
  size: number;
  lastModified: string;
  mimetype: string;
  originalName: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilesResponse {
  success: true;
  message: string;
  data: File[];
  pagination: PaginationInfo;
}
