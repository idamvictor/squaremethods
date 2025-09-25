import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  TeamListParams,
  TeamListResponse,
  TeamDetailResponse,
  UpdateTeamParams,
  UpdateTeamResponse,
  DeleteTeamResponse,
  RemoveTeamMemberResponse,
  TeamMembersResponse,
  AddTeamMemberParams,
  AddTeamMemberResponse,
  InviteTeamMemberParams,
  InviteTeamMemberResponse,
  TeamStatsResponse,
  TeamJobsResponse,
  TeamJobsParams,
} from "./teams-types";

const TEAMS_QUERY_KEY = "teams";

export const fetchTeams = async (
  params: TeamListParams
): Promise<TeamListResponse> => {
  const { page = 1, limit = 20, search } = params;
  const response = await axiosInstance.get<TeamListResponse>("/teams", {
    params: {
      page,
      limit,
      search,
    },
  });
  return response.data;
};

export const fetchTeamDetails = async (
  teamId: string
): Promise<TeamDetailResponse> => {
  const response = await axiosInstance.get<TeamDetailResponse>(
    `/teams/${teamId}`
  );
  return response.data;
};

export const useTeamDetails = (teamId: string) => {
  return useQuery({
    queryKey: [TEAMS_QUERY_KEY, "detail", teamId],
    queryFn: () => fetchTeamDetails(teamId),
    enabled: !!teamId, // Only fetch when teamId is provided
  });
};

export const updateTeam = async (
  teamId: string,
  data: UpdateTeamParams
): Promise<UpdateTeamResponse> => {
  const response = await axiosInstance.put<UpdateTeamResponse>(
    `/teams/${teamId}`,
    data
  );
  return response.data;
};

export const useTeams = (params: TeamListParams = {}) => {
  return useQuery({
    queryKey: [TEAMS_QUERY_KEY, "list", params],
    queryFn: () => fetchTeams(params),
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teamId,
      data,
    }: {
      teamId: string;
      data: UpdateTeamParams;
    }) => updateTeam(teamId, data),
    onSuccess: (data, variables) => {
      // Invalidate teams list query to refresh the data
      queryClient.invalidateQueries({ queryKey: [TEAMS_QUERY_KEY, "list"] });
      // Update team detail in cache
      queryClient.invalidateQueries({
        queryKey: [TEAMS_QUERY_KEY, "detail", variables.teamId],
      });
    },
  });
};

export const deleteTeam = async (
  teamId: string
): Promise<DeleteTeamResponse> => {
  const response = await axiosInstance.delete<DeleteTeamResponse>(
    `/teams/${teamId}`
  );
  return response.data;
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      // Invalidate and refetch teams list after successful deletion
      queryClient.invalidateQueries({ queryKey: [TEAMS_QUERY_KEY, "list"] });
    },
  });
};

export const removeTeamMember = async (
  teamId: string,
  userId: string
): Promise<RemoveTeamMemberResponse> => {
  const response = await axiosInstance.delete<RemoveTeamMemberResponse>(
    `/teams/${teamId}/members/${userId}`
  );
  return response.data;
};

export const useRemoveTeamMember = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => removeTeamMember(teamId, userId),
    onSuccess: () => {
      // Invalidate and refetch team details to update members list
      queryClient.invalidateQueries({
        queryKey: [TEAMS_QUERY_KEY, "detail", teamId],
      });
      // Also refresh the teams list as member count might be shown there
      queryClient.invalidateQueries({
        queryKey: [TEAMS_QUERY_KEY, "list"],
      });
      // Invalidate team members list
      queryClient.invalidateQueries({
        queryKey: [TEAMS_QUERY_KEY, "members", teamId],
      });
    },
  });
};

export const fetchTeamMembers = async (
  teamId: string
): Promise<TeamMembersResponse> => {
  const response = await axiosInstance.get<TeamMembersResponse>(
    `/teams/${teamId}/members`
  );
  return response.data;
};

export const useTeamMembers = (teamId: string) => {
  return useQuery({
    queryKey: [TEAMS_QUERY_KEY, "members", teamId],
    queryFn: () => fetchTeamMembers(teamId),
    enabled: !!teamId, // Only fetch when teamId is provided
  });
};

export const addTeamMember = async (
  teamId: string,
  data: AddTeamMemberParams
): Promise<AddTeamMemberResponse> => {
  const response = await axiosInstance.post<AddTeamMemberResponse>(
    `/teams/${teamId}/members`,
    data
  );
  return response.data;
};

export const useAddTeamMember = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddTeamMemberParams) => addTeamMember(teamId, data),
    onSuccess: () => {
      // Invalidate and refetch team members list
      queryClient.invalidateQueries({
        queryKey: [TEAMS_QUERY_KEY, "members", teamId],
      });
      // Invalidate team details as it might contain members info
      queryClient.invalidateQueries({
        queryKey: [TEAMS_QUERY_KEY, "detail", teamId],
      });
      // Also refresh the teams list as member count might be shown there
      queryClient.invalidateQueries({
        queryKey: [TEAMS_QUERY_KEY, "list"],
      });
    },
  });
};

export const inviteTeamMember = async (
  teamId: string,
  data: InviteTeamMemberParams
): Promise<InviteTeamMemberResponse> => {
  const response = await axiosInstance.post<InviteTeamMemberResponse>(
    `/teams/${teamId}/invite`,
    data
  );
  return response.data;
};

export const useInviteTeamMember = (teamId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => inviteTeamMember(teamId, { email }),
    onSuccess: () => {
      // Optionally invalidate queries if needed
      queryClient.invalidateQueries({
        queryKey: [TEAMS_QUERY_KEY, "members", teamId],
      });
    },
  });
};

export const fetchTeamStats = async (
  teamId: string
): Promise<TeamStatsResponse> => {
  const response = await axiosInstance.get<TeamStatsResponse>(
    `/teams/${teamId}/stats`
  );
  return response.data;
};

export const useTeamStats = (teamId: string) => {
  return useQuery({
    queryKey: [TEAMS_QUERY_KEY, "stats", teamId],
    queryFn: () => fetchTeamStats(teamId),
    enabled: !!teamId, // Only fetch when teamId is provided
  });
};

export const fetchTeamJobs = async (
  teamId: string,
  params: TeamJobsParams
): Promise<TeamJobsResponse> => {
  const { page = 1, limit = 20, status } = params;
  const response = await axiosInstance.get<TeamJobsResponse>(
    `/teams/${teamId}/jobs`,
    {
      params: {
        page,
        limit,
        status,
      },
    }
  );
  return response.data;
};

export const useTeamJobs = (teamId: string, params: TeamJobsParams = {}) => {
  return useQuery({
    queryKey: [TEAMS_QUERY_KEY, "jobs", teamId, params],
    queryFn: () => fetchTeamJobs(teamId, params),
    enabled: !!teamId, // Only fetch when teamId is provided
  });
};
