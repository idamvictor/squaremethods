export type JobPriority = "urgent" | "medium" | "low";
export type JobStatus =
  | "on_hold"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Job {
  id: string;
  company_id: string;
  job_aid_id: string;
  team_id: string;
  created_by: string;
  title: string;
  priority: JobPriority;
  status: JobStatus;
  assigned_to: string;
  description: string;
  due_date: string;
  started_at: string;
  completed_at: string;
  estimated_duration: number;
  actual_duration: number;
  safety_notes: string;
  completion_notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface JobsResponse {
  success: boolean;
  data: Job[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface JobsQueryParams {
  page?: number;
  limit?: number;
  status?: JobStatus;
  priority?: JobPriority;
  team_id?: string;
  assigned_to?: string;
  search?: string;
}

export interface CreateJobInput {
  job_aid_id: string;
  team_id: string;
  assigned_to: string;
  title: string;
  description: string;
  priority: JobPriority;
  due_date: string;
  estimated_duration: number;
  safety_notes: string;
}

export interface JobAid {
  id: string;
  title: string;
  description: string;
}

export interface Team {
  id: string;
  company_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: "admin" | "technician";
  status: "active" | "suspended";
  team_id: string;
  phone: string;
  avatar_url: string;
  email_verified: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  job_id: string;
  procedure_id: string;
  title: string;
  description: string;
  step_number: number;
  status: "pending" | "completed";
  notes: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface JobWithRelations extends Job {
  job_aid: JobAid;
  team: Team;
  assignedUser: User;
  creator: User;
  tasks: Task[];
}

export interface CreateJobResponse {
  success: boolean;
  message: string;
  data: JobWithRelations;
}

export interface OverdueJobsQueryParams {
  page?: number;
  limit?: number;
}

export interface AssignJobInput {
  assigned_to: string;
}

export interface AssignJobResponse {
  success: boolean;
  message: string;
  data: JobWithRelations;
}

export interface StartJobResponse {
  success: boolean;
  message: string;
  data: JobWithRelations;
}

export interface CompleteJobInput {
  completion_notes: string;
}

export interface CompleteJobResponse {
  success: boolean;
  message: string;
  data: JobWithRelations;
}

export interface UpdateTaskInput {
  status: "pending" | "completed";
  notes: string;
}

export interface UpdateTaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface UpdateJobInput {
  title?: string;
  priority?: JobPriority;
  due_date?: string;
}

export interface UpdateJobResponse {
  success: boolean;
  message: string;
  data: JobWithRelations;
}

export interface DeleteJobResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

export interface UserJobsQueryParams {
  page?: number;
  limit?: number;
  status?: JobStatus;
}
