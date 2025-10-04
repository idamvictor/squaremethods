export interface EquipmentType {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationResponse {
  success: boolean;
  message: string;
  data: [];
  pagination: Pagination;
}

export interface EquipmentTypesResponse {
  success: boolean;
  message: string;
  data: EquipmentType[];
  pagination: PaginationResponse;
}

export interface EquipmentTypesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "DESC" | "ASC";
}

export interface CreateEquipmentTypeInput {
  name: string;
  description: string;
  icon: string;
}

export interface CreateEquipmentTypeResponse {
  success: boolean;
  message: string;
  data: EquipmentType;
}

export interface DeleteEquipmentTypeResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface UpdateEquipmentTypeInput {
  name?: string;
  description?: string;
  icon?: string;
  slug?: string;
}

export interface UpdateEquipmentTypeResponse {
  success: boolean;
  message: string;
  data: EquipmentType;
}

export interface EquipmentTypeResponse {
  success: boolean;
  message: string;
  data: EquipmentType;
}

export interface DefaultEquipmentTypesSummary {
  total: number;
  created: number;
  skipped: number;
}

export interface DefaultEquipmentTypesResponse {
  success: boolean;
  message: string;
  data: {
    created: EquipmentType[];
    skipped: string[];
    summary: DefaultEquipmentTypesSummary;
  };
}
