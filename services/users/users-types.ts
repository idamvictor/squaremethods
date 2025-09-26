export interface Company {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
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
