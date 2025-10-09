export type JobAidStatus = "draft" | "published";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface JobAid {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  instructions: string | null;
  safety_notes: string;
  equipment_type_id: string | null;
  location_id: string | null;
  created_by: string;
  status: JobAidStatus;
  difficulty_level: DifficultyLevel;
  estimated_duration: number | null;
  tags: string[];
  version: number;
  image_url: string | null;
  qrcode: string | null;
  view_count: number;
  scan_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  equipmentType: unknown | null;
  location: unknown | null;
  creator: Creator;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface JobAidsResponse {
  status: string;
  data: JobAid[];
  pagination: Pagination;
}

export interface JobAidResponse {
  status: string;
  data: JobAid;
  message: string;
}

export interface JobAidsQueryParams {
  page?: number;
  limit?: number;
  status?: JobAidStatus;
  equipment_id?: string;
  search?: string;
}

export interface CreateJobAidInput {
  equipment_id: string;
  title: string;
  description: string;
  status: JobAidStatus;
  safety_notes: string;
}

export interface UpdateJobAidInput {
  title?: string;
  description?: string;
  status?: JobAidStatus;
  safety_notes?: string;
}
