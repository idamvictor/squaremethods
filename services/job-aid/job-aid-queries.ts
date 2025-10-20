import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  CreateJobAidInput,
  UpdateJobAidInput,
  JobAidResponse,
  JobAidsQueryParams,
  JobAidsResponse,
  CreateJobAidProcedureInput,
  JobAidProcedureResponse,
  JobAidProceduresListResponse,
  UpdateJobAidProcedureInput,
  CreateJobAidPrecautionInput,
  JobAidPrecautionResponse,
  PrecautionsListResponse,
  UpdateJobAidPrecautionInput,
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
  const response = await axiosInstance.put<JobAidResponse>(
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

// =============================== Add Job Aid Procedure ===============================

// Fetch function separate from the mutation
export const createJobAidProcedure = async (
  input: CreateJobAidProcedureInput
) => {
  const response = await axiosInstance.post<JobAidProcedureResponse>(
    `/job-aids/${input.job_aid_id}/procedures`,
    input
  );
  return response.data;
};

// Mutation function using the fetch function
export const useCreateJobAidProcedure = (jobAidId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJobAidProcedure,
    onSuccess: () => {
      // Invalidate and refetch the specific job aid query to update procedures
      queryClient.invalidateQueries({ queryKey: ["job-aid", jobAidId] });
    },
  });
};

//=============================== Job Aid Procedure ================================

// Fetch function separate from the query
export const fetchProcedures = async (params?: JobAidsQueryParams) => {
  const { data } = await axiosInstance.get<JobAidProceduresListResponse>(
    "/procedures",
    {
      params,
    }
  );
  return data;
};

// Query function using the fetch function
export const useProcedures = (params: JobAidsQueryParams = {}) => {
  return useQuery({
    queryKey: ["procedures", params],
    queryFn: () => fetchProcedures(params),
  });
};

// =============================== Update Job Aid Procedure ===============================

// Fetch function separate from the mutation
export const updateJobAidProcedure = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobAidProcedureInput;
}) => {
  const response = await axiosInstance.put<JobAidProcedureResponse>(
    `/procedures/${id}`,
    data
  );
  return response.data;
};

// Mutation function using the fetch function
export const useUpdateJobAidProcedure = (jobAidId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateJobAidProcedureInput;
    }) => updateJobAidProcedure({ id, data }),
    onSuccess: () => {
      // Invalidate and refetch both the procedures list and the specific job aid
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      queryClient.invalidateQueries({ queryKey: ["job-aid", jobAidId] });
    },
  });
};

// =============================== Delete Job Aid Procedure ===============================

// Fetch function separate from the mutation
export const deleteJobAidProcedure = async (id: string) => {
  const response = await axiosInstance.delete<{
    status: string;
    message: string;
    data: null;
  }>(`/procedures/${id}`);
  return response.data;
};

// Mutation function using the fetch function
export const useDeleteJobAidProcedure = (jobAidId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJobAidProcedure,
    onSuccess: () => {
      // Invalidate and refetch both the procedures list and the specific job aid
      queryClient.invalidateQueries({ queryKey: ["procedures"] });
      queryClient.invalidateQueries({ queryKey: ["job-aid", jobAidId] });
    },
  });
};

// =============================== Add Job Aid Precaution ===============================

// Fetch function separate from the mutation
export const createJobAidPrecaution = async (
  input: CreateJobAidPrecautionInput
) => {
  const response = await axiosInstance.post<JobAidPrecautionResponse>(
    `/precautions`,
    input
  );
  return response.data;
};

// Mutation function using the fetch function
export const useCreateJobAidPrecaution = (jobAidId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJobAidPrecaution,
    onSuccess: () => {
      // Invalidate and refetch the specific job aid to update precautions
      queryClient.invalidateQueries({ queryKey: ["job-aid", jobAidId] });
    },
  });
};

// ============================== Job Aid Precaution ================================

// Fetch function separate from the query
export const fetchPrecautions = async (params?: JobAidsQueryParams) => {
  const { data } = await axiosInstance.get<PrecautionsListResponse>(
    "/precautions",
    {
      params,
    }
  );
  return data;
};

// Query function using the fetch function
export const usePrecautions = (params: JobAidsQueryParams = {}) => {
  return useQuery({
    queryKey: ["precautions", params],
    queryFn: () => fetchPrecautions(params),
  });
};

// =============================== Update Job Aid Precaution ===============================

// Fetch function separate from the mutation
export const updateJobAidPrecaution = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateJobAidPrecautionInput;
}) => {
  const response = await axiosInstance.put<JobAidPrecautionResponse>(
    `/precautions/${id}`,
    data
  );
  return response.data;
};

// Mutation function using the fetch function
export const useUpdateJobAidPrecaution = (jobAidId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateJobAidPrecautionInput;
    }) => updateJobAidPrecaution({ id, data }),
    onSuccess: () => {
      // Invalidate and refetch both the precautions list and the specific job aid
      queryClient.invalidateQueries({ queryKey: ["precautions"] });
      queryClient.invalidateQueries({ queryKey: ["job-aid", jobAidId] });
    },
  });
};

//=============================== Delete Job Aid Precaution ===============================

// Fetch function separate from the mutation
export const deleteJobAidPrecaution = async (id: string) => {
  const response = await axiosInstance.delete<{
    status: string;
    message: string;
    data: null;
  }>(`/precautions/${id}`);
  return response.data;
};

// Mutation function using the fetch function
export const useDeleteJobAidPrecaution = (jobAidId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJobAidPrecaution,
    onSuccess: () => {
      // Invalidate and refetch both the precautions list and the specific job aid
      queryClient.invalidateQueries({ queryKey: ["precautions"] });
      queryClient.invalidateQueries({ queryKey: ["job-aid", jobAidId] });
    },
  });
};
