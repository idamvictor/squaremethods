export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  timezone: string;
  currency: string;
  address: string;
  created_at: string;
}

export interface CompanyProfile extends Company {
  email: string;
  subscription_plan: "free" | "basic" | "premium";
  subscription_status: "active" | "expired" | "cancelled";
  updated_at: string;
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  data: Company;
}

export interface CompanyProfileResponse {
  success: boolean;
  message: string;
  data: CompanyProfile;
}

export interface UpdateCompanySettingsRequest {
  name?: string;
  address?: string;
  email?: string;
  timezone?: string;
  currency?: string;
}

export interface CompanyStatistics {
  users: {
    total: number;
    active: number;
  };
  teams: {
    total: number;
    active: number;
  };
  jobs: {
    total: number;
    active: number;
    completed: number;
  };
  equipment: {
    total: number;
  };
  jobAids: {
    total: number;
    published: number;
  };
}

export interface CompanyStatisticsResponse {
  success: boolean;
  message: string;
  data: CompanyStatistics;
}

export interface CompanyUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  status: string;
  last_login: string;
  email_verified: boolean;
  created_at: string;
}

export interface CompanyUsersPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompanyUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: CompanyUser[];
    pagination: CompanyUsersPagination;
  };
}

export interface CompanyUsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface SubscriptionUsage {
  users: number;
  teams: number;
  storage_used: string;
}

export interface CompanySubscription {
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "inactive" | "suspended" | "cancelled";
  users_limit: number;
  teams_limit: number;
  storage_limit: string;
  features: string[];
  billing_cycle: "monthly" | "yearly";
  next_billing_date: string;
  usage: SubscriptionUsage;
}

export interface CompanySubscriptionResponse {
  success: boolean;
  message: string;
  data: CompanySubscription;
}
