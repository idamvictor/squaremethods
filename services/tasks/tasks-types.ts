export interface BaseQueryParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface JobAid {
  id: string;
  title: string;
  slug: string;
  category: string;
  instruction: string;
  created_by: string;
  status: "draft" | string; // Add more specific status types if available
  image: string;
  estimated_duration: number;
  qrcode: string | null;
  view_count: number;
  scan_count: number;
  published_at: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  TaskJobAid: TaskJobAid;
}

export interface TaskJobAid {
  id: string;
  company_id: string;
  task_id: string;
  job_aid_id: string;
  order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Task {
  id: string;
  title: string;
  jobAids: JobAid[];
}

export interface TasksQueryParams extends BaseQueryParams {
  search?: string;
}

export interface CreateTaskInput {
  job_aid_ids: string[];
  title: string;
}

export interface UpdateTaskInput {
  name: string;
}

export interface UpdateTaskResponse {
  status: string;
  data: Task;
  message: string;
}

export interface DeleteTaskResponse {
  status: string;
  data: null;
  message: string;
}

export interface TasksResponse {
  status: string;
  data: Task[];
  pagination: PaginationResponse;
}

export interface CreateTaskResponse {
  status: string;
  data: Task;
  message: string;
}

export interface TaskResponse {
  status: string;
  data: Task;
}
