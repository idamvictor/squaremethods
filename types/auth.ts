export interface User {
  id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  role: "owner" | "admin" | "user";
  status: "active" | "inactive";
  avatar_url: string;
  email_verified: boolean;
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  address: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
    company: Company;
  };
}
