import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/api/axios";
import {
  UserFilters,
  UsersResponse,
  ProfileResponse,
  UpdateProfileRequest,
  DashboardResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UserActivityResponse,
  ActivityFilters,
} from "./users-types";

const USERS_QUERY_KEY = "users";

// List Company Users

const getUsers = async (filters: UserFilters): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();

  // Add all filters to query params
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.search) queryParams.append("search", filters.search);
  if (filters.role) queryParams.append("role", filters.role);
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.team_id) queryParams.append("team_id", filters.team_id);

  const response = await axios.get(`/users?${queryParams.toString()}`);
  return response.data;
};

export const useUsers = (filters: UserFilters = { page: 1, limit: 20 }) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, filters],
    queryFn: () => getUsers(filters),
    placeholderData: (previousData) => previousData, // This replaces keepPreviousData in newer versions
  });
};

// ======================= Profile ======================

// Get Profile
const PROFILE_QUERY_KEY = "profile";

const getProfile = async (): Promise<ProfileResponse> => {
  const response = await axios.get("/users/profile");
  return response.data;
};

export const useProfile = () => {
  return useQuery({
    queryKey: [PROFILE_QUERY_KEY],
    queryFn: getProfile,
  });
};

// Update Profile current user profile
const updateProfile = async (
  data: UpdateProfileRequest
): Promise<ProfileResponse> => {
  const response = await axios.put("/users/profile", data);
  return response.data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Invalidate the profile query to refetch the latest data
      queryClient.invalidateQueries({ queryKey: [PROFILE_QUERY_KEY] });
    },
  });
};

//====================== Dashboard ==========================

//Get User Dashboard
const DASHBOARD_QUERY_KEY = "dashboard";

const getDashboard = async (): Promise<DashboardResponse> => {
  const response = await axios.get("/users/dashboard");
  return response.data;
};

export const useDashboard = () => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY],
    queryFn: getDashboard,
  });
};

//================= Users/{id} =======================

// Change user Password
const changePassword = async (
  userId: string,
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  const response = await axios.put(`/users/${userId}/password`, data);
  return response.data;
};

export const useChangePassword = (userId: string) => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => changePassword(userId, data),
  });
};

// Get User Activity
const getUserActivity = async (
  userId: string,
  filters: ActivityFilters = { page: 1, limit: 20 }
): Promise<UserActivityResponse> => {
  const queryParams = new URLSearchParams();

  // Add pagination params
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());

  const response = await axios.get(
    `/users/${userId}/activity?${queryParams.toString()}`
  );
  return response.data;
};

export const useUserActivity = (
  userId: string,
  filters: ActivityFilters = { page: 1, limit: 20 }
) => {
  return useQuery({
    queryKey: ["userActivity", userId, filters],
    queryFn: () => getUserActivity(userId, filters),
    placeholderData: (previousData) => previousData,
  });
};

//Get User Activity
