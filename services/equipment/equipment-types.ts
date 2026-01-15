export interface EquipmentType {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  icon: string | null;
  slug: string;
  parent_location_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Procedure {
  id: string;
  company_id: string;
  job_aid_id: string;
  title: string;
  image: string;
  step: number;
  instruction: string;
  type: "procedure";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
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

export interface JobAidEquipment {
  id: string;
  company_id: string;
  job_aid_id: string;
  equipment_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface JobAid {
  id: string;
  title: string;
  slug: string;
  category: string;
  instruction: string;
  created_by: string;
  status: "draft" | "published" | string;
  image: string | null;
  estimated_duration: number;
  qrcode: string | null;
  view_count: number;
  scan_count: number;
  published_at: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  JobAidEquipment: JobAidEquipment;
  creator: User;
  procedures: Procedure[];
  precautions: Precaution[];
}

export interface FailureMode {
  id: string;
  equipment_id: string;
  reported_by: string;
  image: string | null;
  title: string;
  status: "open" | "closed" | string;
  resolutions: string[];
  due_date: string;
  reporter: User;
}

export interface Equipment {
  id: string;
  equipment_type_id: string;
  name: string;
  slug: string;
  reference_code: string;
  status: "draft" | string; // Add other status types as needed
  location_id: string;
  image: string | null;
  icon: string | null;
  documents: string[] | null;
  notes: string;
  qrcode: string | null;
  created_at: string;
  updated_at: string;
  equipmentType: EquipmentType;
  location: Location;
  jobAids?: JobAid[];
  failureModes?: FailureMode[];
}

export interface EquipmentMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EquipmentResponse {
  success: boolean;
  data: Equipment[];
  meta: EquipmentMeta;
}

export interface EquipmentQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  location_id?: string;
  equipment_type_id?: string;
  search?: string;
}

export interface CreateEquipmentInput {
  equipment_type_id: string;
  location_id: string;
  name: string;
  reference_code: string;
  notes: string;
  status: string;
  image?: string;
}

export interface UpdateEquipmentInput {
  name?: string;
  notes?: string;
  status?: string;
  documents?: string[];
}

export interface EquipmentQRCode {
  url: string;
}

export interface EquipmentQRCodeResponse {
  success: boolean;
  data: EquipmentQRCode;
}

export interface GetEquipmentResponse {
  success: boolean;
  message: string;
  data: Equipment;
}

export interface DeleteEquipmentResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

export interface ScanEquipmentResponse {
  success: boolean;
  message: string;
  data: Equipment;
}

export interface EquipmentStats {
  total: number;
  published: number;
  draft: number;
  withQR: number;
  withImages: number;
}

export interface EquipmentStatsResponse {
  success: boolean;
  data: EquipmentStats;
}

export interface CreateEquipmentResponse {
  success: boolean;
  message: string;
  data: Equipment;
}
