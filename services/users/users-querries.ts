import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/api/axios";
import { UserFilters, UsersResponse } from "./users-types";

const USERS_QUERY_KEY = "users";

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
