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
  UserJobsResponse,
  UserJobsFilters,
  ActivateUserResponse,
  UserDetailsResponse,
  UpdateUserRequest,
  CreateUserRequest,
  CreateUserResponse,
} from "./users-types";

const USERS_QUERY_KEY = "users";

// =============== Users ==================

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

// Create new user
const createUser = async (
  data: CreateUserRequest
): Promise<CreateUserResponse> => {
  const response = await axios.post("/users", data);
  return response.data;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate the users list to refetch with the new user
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
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

// Get User Details
const getUserDetails = async (userId: string): Promise<UserDetailsResponse> => {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
};

export const useUserDetails = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserDetails(userId),
    enabled: !!userId,
  });
};

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

//Get user jobs
const getUserJobs = async (
  userId: string,
  filters: UserJobsFilters = { page: 1, limit: 20 }
): Promise<UserJobsResponse> => {
  const queryParams = new URLSearchParams();

  // Add all filters to query params
  if (filters.page) queryParams.append("page", filters.page.toString());
  if (filters.limit) queryParams.append("limit", filters.limit.toString());
  if (filters.status) queryParams.append("status", filters.status);
  if (filters.priority) queryParams.append("priority", filters.priority);

  const response = await axios.get(
    `/users/${userId}/jobs?${queryParams.toString()}`
  );
  return response.data;
};

export const useUserJobs = (
  userId: string,
  filters: UserJobsFilters = { page: 1, limit: 20 }
) => {
  return useQuery({
    queryKey: ["userJobs", userId, filters],
    queryFn: () => getUserJobs(userId, filters),
    placeholderData: (previousData) => previousData,
  });
};

// Activate user
const activateUser = async (userId: string): Promise<ActivateUserResponse> => {
  const response = await axios.put(`/users/${userId}/activate`);
  return response.data;
};

export const useActivateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => activateUser(userId),
    onSuccess: () => {
      // Invalidate both the specific user query and the users list
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};

// Deactivate user
const deactivateUser = async (
  userId: string
): Promise<ActivateUserResponse> => {
  const response = await axios.put(`/users/${userId}/deactivate`);
  return response.data;
};

export const useDeactivateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deactivateUser(userId),
    onSuccess: () => {
      // Invalidate both the specific user query and the users list
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};

// update user
const updateUser = async (
  userId: string,
  data: UpdateUserRequest
): Promise<UserDetailsResponse> => {
  const response = await axios.put(`/users/${userId}`, data);
  return response.data;
};

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUser(userId, data),
    onSuccess: () => {
      // Invalidate both the specific user query and the users list
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });
};

// Delete user
const deleteUser = async (userId: string): Promise<ChangePasswordResponse> => {
  const response = await axios.delete(`/users/${userId}`);
  return response.data;
};

export const useDeleteUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(userId),
    onSuccess: () => {
      // Remove the user from the cache and invalidate the users list
      queryClient.removeQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
    },
  });
};

// Delete User
