export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: "admin" | "technician" | string;
  status: "active" | string;
  team_id: string;
  phone: string;
  avatar_url: string;
  email_verified: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "manager" | "member" | string;
  joined_at: string;
  user: User;
}

export interface Team {
  id: string;
  company_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateTeamParams {
  name: string;
  description: string;
}

export interface CreateTeamResponse {
  success: boolean;
  message: string;
  data: TeamDetail;
}

export interface TeamDetail extends Team {
  members: TeamMember[];
  jobs: any[]; // Keeping the jobs array as requested
}

export interface TeamListResponse {
  success: boolean;
  data: Team[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TeamDetailResponse {
  success: boolean;
  message: string;
  data: TeamDetail;
}

export interface TeamListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateTeamParams {
  name: string;
  description: string;
}

export interface UpdateTeamResponse {
  success: boolean;
  message: string;
  data: TeamDetail;
}

export interface DeleteTeamResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

export interface RemoveTeamMemberResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

export interface TeamMembersResponse {
  success: boolean;
  data: TeamMember[];
}

export interface AddTeamMemberParams {
  user_id: string;
  role: "manager" | "member";
}

export interface AddTeamMemberResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

export interface InviteTeamMemberParams {
  email: string;
}

export interface InviteTeamMemberResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

export interface TeamStats {
  memberCount: number;
  activeJobs: number;
  completedJobs: number;
  overdueJobs: number;
  avgCompletionTime: number;
}

export interface TeamStatsResponse {
  success: boolean;
  data: TeamStats;
}

export interface Job {
  id: string;
  company_id: string;
  job_aid_id: string;
  team_id: string;
  created_by: string;
  title: string;
  priority: "urgent" | "medium" | string;
  status: "completed" | "pending" | "on_hold" | string;
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
  deleted_at?: string;
}

export interface TeamJobsResponse {
  success: boolean;
  data: Job[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface TeamJobsParams {
  page?: number;
  limit?: number;
  status?: "completed" | "pending" | "on_hold" | string;
}
