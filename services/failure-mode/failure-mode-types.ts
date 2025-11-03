export interface Equipment {
  id: string;
  equipment_type_id: string;
  location_id: string;
  name: string;
  slug: string;
  reference_code: string;
  image: string | null;
  icon: string | null;
  documents: string[] | null;
  notes: string;
  status: string;
  qrcode: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  avatar_url: string;
}

export interface FailureMode {
  id: string;
  equipment_id: string;
  reported_by: string;
  image: string | null;
  title: string;
  status: "open" | "resolved" | "in_progress";
  priority: "low" | "medium" | "high";
  resolutions: string[];
  due_date: string | null;
  equipment: Equipment;
  reporter: User;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface FailureModesResponse {
  status: string;
  data: FailureMode[];
  pagination: Pagination;
}

export interface EquipmentFailureModesResponse {
  status: string;
  data: FailureMode[];
}

export interface FailureModeResponse {
  status: string;
  data: FailureMode;
  message: string;
}

export interface CreateFailureModeInput {
  equipment_id: string;
  reported_by: string;
  image?: string;
  title: string;
  status: "open" | "resolved" | "in_progress";
  priority: "low" | "medium" | "high";
  resolutions: string[];
  due_date?: string;
}

export interface UpdateFailureModeInput {
  title?: string;
  status?: "open" | "resolved" | "in_progress";
  priority?: "low" | "medium" | "high";
  resolutions?: string[];
  due_date?: string;
}

export interface DeleteFailureModeResponse {
  status: string;
  data: null;
  message: string;
}

export interface FailureModesQueryParams {
  page?: number;
  limit?: number;
}
