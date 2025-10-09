import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  CreateJobAidInput,
  UpdateJobAidInput,
  JobAidResponse,
  JobAidsQueryParams,
  JobAidsResponse,
} from "./job-aid-types";

//=============================== List Company Job Aids ===============================

// Fetch function separate from the query
export const fetchJobAids = async (params: JobAidsQueryParams) => {
  const { data } = await axiosInstance.get<JobAidsResponse>("/job-aids", {
    params,
  });
  return data;
};

// Query function using the fetch function
export const useJobAids = (params: JobAidsQueryParams = {}) => {
  return useQuery({
    queryKey: ["job-aids", params],
    queryFn: () => fetchJobAids(params),
  });
};

//=============================== Create new job aid ============================

// Fetch function separate from the mutation
export const createJobAid = async (input: CreateJobAidInput) => {
  const { data } = await axiosInstance.post<JobAidResponse>("/job-aids", input);
  return data;
};

// Mutation function using the fetch function
export const useCreateJobAid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJobAid,
    onSuccess: () => {
      // Invalidate job aids queries to refetch the list
      queryClient.invalidateQueries({ queryKey: ["job-aids"] });
    },
  });
};

//=============================== Get Job aid details ============================

// Fetch function separate from the query
export const fetchJobAidDetails = async (id: string) => {
  const { data } = await axiosInstance.get<JobAidResponse>(`/job-aids/${id}`);
  return data;
};

// Query function using the fetch function
export const useJobAidDetails = (id: string) => {
  return useQuery({
    queryKey: ["job-aid", id],
    queryFn: () => fetchJobAidDetails(id),
    enabled: !!id, // Only fetch when id is available
  });
};

// =============================== Update Job Aid ===============================

// Fetch function separate from the mutation
export const updateJobAid = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobAidInput;
}) => {
  const response = await axiosInstance.patch<JobAidResponse>(
    `/job-aids/${id}`,
    data
  );
  return response.data;
};

// Mutation function using the fetch function
export const useUpdateJobAid = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateJobAidInput) => updateJobAid({ id, data }),
    onSuccess: () => {
      // Invalidate and refetch the specific job aid query
      queryClient.invalidateQueries({ queryKey: ["job-aid", id] });
      // Also invalidate the job aids list
      queryClient.invalidateQueries({ queryKey: ["job-aids"] });
    },
  });
};

// =============================== Delete Job Aid ===============================

// Fetch function separate from the mutation
export const deleteJobAid = async (id: string) => {
  const response = await axiosInstance.delete<{
    status: string;
    message: string;
    data: null;
  }>(`/job-aids/${id}`);
  return response.data;
};

// Mutation function using the fetch function
export const useDeleteJobAid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJobAid,
    onSuccess: () => {
      // Invalidate the job aids list to refetch after deletion
      queryClient.invalidateQueries({ queryKey: ["job-aids"] });
    },
  });
};
