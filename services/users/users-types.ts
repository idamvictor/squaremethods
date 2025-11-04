export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string | null;
  role: string;
  team_id: string | null;
  email_verified: boolean;
  email_verified_at: string | null;
  is_active: boolean;
  last_login: string | null;
  otp_verified: boolean;
  status: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  company: Company;
  team: Team | null;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UsersResponse {
  status: string;
  data: User[];
  pagination: Pagination;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  team_id?: string;
}

export interface UserProfile extends Omit<User, "team"> {
  teams: Team[];
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  current_password?: string;
  new_password?: string;
  avatar_url?: string;
}

export interface DashboardStats {
  assignedJobs: number;
  completedJobs: number;
  overdueJobs: number;
  totalJobAids: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export interface DashboardData {
  user: Omit<User, "company" | "team">;
  stats: DashboardStats;
  recentActivity: ActivityLog[];
}

export interface ActivateUserResponse {
  success: boolean;
  message: string;
  data: Omit<User, "company" | "team">;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

export interface ActivityMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserActivityResponse {
  success: boolean;
  data: ActivityLog[];
  meta: ActivityMeta;
}

export interface ActivityFilters {
  page?: number;
  limit?: number;
}

export interface Job {
  id: string;
  company_id: string;
  job_aid_id: string;
  team_id: string;
  created_by: string;
  title: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "pending" | "in_progress" | "completed" | "on_hold";
  assigned_to: string;
  description: string;
  due_date: string;
  started_at: string | null;
  completed_at: string | null;
  estimated_duration: number;
  actual_duration: number;
  safety_notes: string;
  completion_notes: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserJobsResponse {
  success: boolean;
  data: Job[];
  meta: ActivityMeta; // Reusing the same meta interface as it has the same structure
}

export interface UserJobsFilters extends ActivityFilters {
  status?: Job["status"];
  priority?: Job["priority"];
}

export interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: Omit<User, "company" | "team">;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role?: string;
}

export interface CreateUserRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  team_id: string;
  password: string;
}

export interface CreateUserResponse {
  status: string;
  message: string;
  data: User;
}
