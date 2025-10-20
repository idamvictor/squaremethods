export type JobAidStatus = "draft" | "published";
export type DifficultyLevel = "easy" | "medium" | "hard";

export interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AssignedEquipment {
  id: string;
  equipment_type_id: string;
  location_id: string;
  name: string;
  slug: string;
  reference_code: string;
  image: string | null;
  icon: string | null;
  documents: string | null;
  notes: string;
  status: string;
  qrcode: string | null;
  created_at: string;
  updated_at: string;
}

export interface JobAid {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  instruction: string | null;
  created_by: string;
  status: JobAidStatus;
  image: string | null;
  estimated_duration: number | null;
  qrcode: string | null;
  view_count: number;
  scan_count: number;
  published_at: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  assignedEquipments: AssignedEquipment[];
  creator: Creator;
  procedures: JobAidProcedure[];
  precautions: Precaution[];
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

export interface Precaution {
  id: string;
  company_id: string;
  job_aid_id: string;
  title: string;
  image: string;
  step: number;
  instruction: string;
  type: "precaution";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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

export interface CreateJobAidProcedureInput {
  job_aid_id: string;
  step: number;
  instruction: string;
  image: string;
}

export interface JobAidProcedure {
  id: string;
  company_id: string;
  job_aid_id: string;
  title: string;
  step: number;
  instruction: string;
  image: string;
  type: "procedure";
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface JobAidProcedureResponse {
  status: string;
  data: JobAidProcedure;
  message: string;
}

export interface JobAidProcedureList {
  id: string;
  job_aid_id: string;
  title: string;
  image: string;
  step: number;
  instruction: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface JobAidProceduresListResponse {
  status: string;
  data: JobAidProcedureList[];
  pagination: Pagination;
}

export interface UpdateJobAidProcedureInput {
  instruction: string;
  step: number;
  title: string;
  image: string;
}

export interface CreateJobAidPrecautionInput {
  job_aid_id: string;
  instruction: string;
  image: string;
}

export interface JobAidPrecautionResponse {
  status: string;
  data: Precaution;
  message: string;
}

export interface PrecautionList {
  id: string;
  job_aid_id: string;
  title: string;
  image: string;
  step: number;
  instruction: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PrecautionsListResponse {
  status: string;
  data: PrecautionList[];
  pagination: Pagination;
}

export interface UpdateJobAidPrecautionInput {
  instruction: string;
  image: string;
}
