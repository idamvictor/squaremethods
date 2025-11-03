import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  InvitationsResponse,
  InvitationResponse,
  SendInvitationRequest,
  SendInvitationResponse,
  GenerateInvitationLinkRequest,
  GenerateInvitationLinkResponse,
  ValidateInvitationResponse,
  RevokeInvitationResponse,
} from "./invitation-types";

interface FetchInvitationsParams {
  page?: number;
  limit?: number;
}

//========================================= List Invitations =========================================//

// Separate fetch function
export const fetchInvitations = async ({
  page = 1,
  limit = 20,
}: FetchInvitationsParams = {}) => {
  const response = await axiosInstance.get<InvitationsResponse>(
    `/invitations?page=${page}&limit=${limit}`
  );
  return response.data;
};

// Query hook that uses the fetch function
export const useInvitations = (params: FetchInvitationsParams = {}) => {
  return useQuery({
    queryKey: ["invitations", params],
    queryFn: () => fetchInvitations(params),
  });
};

//========================================= Get Invitation By ID =========================================//

// Separate fetch function
export const fetchInvitationById = async (id: string) => {
  const response = await axiosInstance.get<InvitationResponse>(
    `/invitations/${id}`
  );
  return response.data;
};

// Query hook that uses the fetch function
export const useInvitation = (id: string) => {
  return useQuery({
    queryKey: ["invitation", id],
    queryFn: () => fetchInvitationById(id),
    enabled: !!id,
  });
};

//========================================= Send Invitations =========================================//

// Separate send function
export const sendInvitations = async (data: SendInvitationRequest) => {
  const response = await axiosInstance.post<SendInvitationResponse>(
    "/invitations/send-invites",
    data
  );
  return response.data;
};

// Mutation hook that uses the send function
export const useSendInvitations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendInvitations,
    onSuccess: () => {
      // Invalidate the invitations list query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

//========================================= Generate Invitation Link =========================================//

// Separate generate link function
export const generateInvitationLink = async (
  data: GenerateInvitationLinkRequest
) => {
  const response = await axiosInstance.post<GenerateInvitationLinkResponse>(
    "/invitations/generate-link",
    data
  );
  return response.data;
};

// Mutation hook that uses the generate link function
export const useGenerateInvitationLink = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateInvitationLink,
    onSuccess: () => {
      // Invalidate the invitations list query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

//========================================= Validate Invitation Token =========================================//

// Separate validate function
export const validateInvitationToken = async (token: string) => {
  const response = await axiosInstance.get<ValidateInvitationResponse>(
    `/invitations/validate/${token}`
  );
  return response.data;
};

// Query hook that uses the validate function
export const useValidateInvitationToken = (token: string | null) => {
  return useQuery({
    queryKey: ["invitation-validation", token],
    queryFn: () => validateInvitationToken(token!),
    enabled: !!token,
  });
};

//========================================= Revoke Invitation =========================================//

// Separate revoke function
export const revokeInvitation = async (id: string) => {
  const response = await axiosInstance.delete<RevokeInvitationResponse>(
    `/invitations/${id}`
  );
  return response.data;
};

// Mutation hook that uses the revoke function
export const useRevokeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: revokeInvitation,
    onSuccess: () => {
      // Invalidate the invitations list query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};
