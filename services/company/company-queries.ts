import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/api/axios";
import {
  CompanyResponse,
  CompanyProfileResponse,
  UpdateCompanySettingsRequest,
  CompanyStatisticsResponse,
  CompanyUsersResponse,
  CompanyUsersFilters,
  CompanySubscriptionResponse,
} from "./company-types";

const COMPANY_QUERY_KEY = "company";

// ===================== Company By Slug =====================

const getCompanyBySlug = async (slug: string): Promise<CompanyResponse> => {
  const response = await axios.get(`/company/slug/${slug}`);
  return response.data;
};

export const useCompanyBySlug = (slug: string) => {
  return useQuery({
    queryKey: [COMPANY_QUERY_KEY, "slug", slug],
    queryFn: () => getCompanyBySlug(slug),
    enabled: !!slug,
  });
};

// ===================== Company Profile =====================

const getCompanyProfile = async (): Promise<CompanyProfileResponse> => {
  const response = await axios.get("/company/profile");
  return response.data;
};

export const useCompanyProfile = () => {
  return useQuery({
    queryKey: [COMPANY_QUERY_KEY, "profile"],
    queryFn: getCompanyProfile,
  });
};

// =================== Company Settings ====================

const updateCompanySettings = async (
  data: UpdateCompanySettingsRequest
): Promise<CompanyProfileResponse> => {
  const response = await axios.put("/company/settings", data);
  return response.data;
};

export const useUpdateCompanySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompanySettings,
    onSuccess: () => {
      // Invalidate both company profile and any company by slug queries
      queryClient.invalidateQueries({ queryKey: [COMPANY_QUERY_KEY] });
    },
  });
};

// =================== Company Statistics ====================

const getCompanyStatistics = async (): Promise<CompanyStatisticsResponse> => {
  const response = await axios.get("/company/statistics");
  return response.data;
};

export const useCompanyStatistics = () => {
  return useQuery({
    queryKey: [COMPANY_QUERY_KEY, "statistics"],
    queryFn: getCompanyStatistics,
    // Refresh statistics every minute as they might change frequently
    refetchInterval: 60 * 1000,
  });
};

// =================== Company Users ====================

const getCompanyUsers = async (
  filters: CompanyUsersFilters
): Promise<CompanyUsersResponse> => {
  const queryParams = new URLSearchParams();

  // Add all filters to query params
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.role) queryParams.append("role", filters.role);
  if (filters.status) queryParams.append("status", filters.status);

  const response = await axios.get(`/company/users?${queryParams.toString()}`);
  return response.data;
};

export const useCompanyUsers = (
  filters: CompanyUsersFilters = { page: 1, limit: 20 }
) => {
  return useQuery({
    queryKey: [COMPANY_QUERY_KEY, "users", filters],
    queryFn: () => getCompanyUsers(filters),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new data
  });
};

// =================== Company Subscription ====================

const getCompanySubscription =
  async (): Promise<CompanySubscriptionResponse> => {
    const response = await axios.get("/company/subscription");
    return response.data;
  };

export const useCompanySubscription = () => {
  return useQuery({
    queryKey: [COMPANY_QUERY_KEY, "subscription"],
    queryFn: getCompanySubscription,
    // Refresh every 5 minutes to keep usage data current
    refetchInterval: 5 * 60 * 1000,
    // Enable stale time to prevent too frequent refetches
    staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute
  });
};
