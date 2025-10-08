import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  JobsQueryParams,
  JobsResponse,
  CreateJobInput,
  CreateJobResponse,
  OverdueJobsQueryParams,
  AssignJobInput,
  AssignJobResponse,
  StartJobResponse,
  CompleteJobInput,
  CompleteJobResponse,
  UpdateTaskInput,
  UpdateTaskResponse,
  JobWithRelations,
  UpdateJobInput,
  UpdateJobResponse,
  DeleteJobResponse,
  UserJobsQueryParams,
} from "./jobs-types";

export const JOBS_QUERY_KEY = "jobs";

// ============================== List Company Jobs ==============================

// Separate fetch function
export const fetchJobs = async (
  params: JobsQueryParams = {}
): Promise<JobsResponse> => {
  const { data } = await axiosInstance.get<JobsResponse>("/jobs", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      status: params.status,
      priority: params.priority,
      team_id: params.team_id,
      assigned_to: params.assigned_to,
      search: params.search,
    },
  });
  return data;
};

// React Query hook using the fetch function
export const useJobs = (params: JobsQueryParams = {}) => {
  return useQuery<JobsResponse>({
    queryKey: [JOBS_QUERY_KEY, params],
    queryFn: () => fetchJobs(params),
  });
};

// Helper function to construct the query key for jobs
export const getJobsQueryKey = (params: JobsQueryParams = {}) => [
  JOBS_QUERY_KEY,
  params,
];

// ============================== Create New Job ==============================

// Separate fetch function
export const createJob = async (
  input: CreateJobInput
): Promise<CreateJobResponse> => {
  const { data } = await axiosInstance.post<CreateJobResponse>("/jobs", input);
  return data;
};

// React Query mutation hook
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      // Invalidate the jobs list query to refetch after creation
      queryClient.invalidateQueries({ queryKey: [JOBS_QUERY_KEY] });
    },
  });
};

// ============================== Get Overdue Jobs ==============================

// Separate fetch function
export const fetchOverdueJobs = async (
  params: OverdueJobsQueryParams = {}
): Promise<JobsResponse> => {
  const { data } = await axiosInstance.get<JobsResponse>("/jobs/overdue", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
    },
  });
  return data;
};

// React Query hook for overdue jobs
export const useOverdueJobs = (params: OverdueJobsQueryParams = {}) => {
  return useQuery({
    queryKey: [JOBS_QUERY_KEY, "overdue", params],
    queryFn: () => fetchOverdueJobs(params),
  });
};

// Helper function to construct the query key for overdue jobs
export const getOverdueJobsQueryKey = (params: OverdueJobsQueryParams = {}) => [
  JOBS_QUERY_KEY,
  "overdue",
  params,
];

// ============================== Assign Job to user ==============================

// Separate fetch function
export const assignJob = async (
  jobId: string,
  input: AssignJobInput
): Promise<AssignJobResponse> => {
  const { data } = await axiosInstance.post<AssignJobResponse>(
    `/jobs/${jobId}/assign`,
    input
  );
  return data;
};

// React Query mutation hook
export const useAssignJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      assignedTo,
    }: {
      jobId: string;
      assignedTo: string;
    }) => assignJob(jobId, { assigned_to: assignedTo }),
    onSuccess: () => {
      // Invalidate all job-related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [JOBS_QUERY_KEY] });
    },
  });
};

// ============================= Start Job =============================

// Separate fetch function
export const startJob = async (jobId: string): Promise<StartJobResponse> => {
  const { data } = await axiosInstance.post<StartJobResponse>(
    `/jobs/${jobId}/start`
  );
  return data;
};

// React Query mutation hook
export const useStartJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startJob,
    onSuccess: () => {
      // Invalidate all job-related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [JOBS_QUERY_KEY] });
    },
  });
};

// ============================== Complete Job ==============================

// Separate fetch function
export const completeJob = async (
  jobId: string,
  input: CompleteJobInput
): Promise<CompleteJobResponse> => {
  const { data } = await axiosInstance.post<CompleteJobResponse>(
    `/jobs/${jobId}/complete`,
    input
  );
  return data;
};

// React Query mutation hook
export const useCompleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      completionNotes,
    }: {
      jobId: string;
      completionNotes: string;
    }) => completeJob(jobId, { completion_notes: completionNotes }),
    onSuccess: () => {
      // Invalidate all job-related queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: [JOBS_QUERY_KEY] });
    },
  });
};

// ============================== Update Task Status ==============================

// Separate fetch function
export const updateTaskStatus = async (
  jobId: string,
  taskId: string,
  input: UpdateTaskInput
): Promise<UpdateTaskResponse> => {
  const { data } = await axiosInstance.patch<UpdateTaskResponse>(
    `/jobs/${jobId}/tasks/${taskId}`,
    input
  );
  return data;
};

// React Query mutation hook
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      taskId,
      status,
      notes,
    }: {
      jobId: string;
      taskId: string;
      status: "pending" | "completed";
      notes: string;
    }) => updateTaskStatus(jobId, taskId, { status, notes }),
    onSuccess: (_, variables) => {
      // Invalidate the specific job query to refetch with updated task data
      queryClient.invalidateQueries({
        queryKey: [JOBS_QUERY_KEY, variables.jobId],
      });
    },
  });
};

// ============================== Get Job Details ==============================

// Separate fetch function
export const fetchJobById = async (
  jobId: string
): Promise<JobWithRelations> => {
  const { data } = await axiosInstance.get<{
    success: boolean;
    message: string;
    data: JobWithRelations;
  }>(`/jobs/${jobId}`);
  return data.data;
};

// React Query hook for job details
export const useJobById = (jobId: string | undefined) => {
  return useQuery({
    queryKey: [JOBS_QUERY_KEY, jobId],
    queryFn: () => fetchJobById(jobId!),
    enabled: !!jobId, // Only fetch when jobId is provided
  });
};

// Helper function to construct the query key for a specific job
export const getJobByIdQueryKey = (jobId: string) => [JOBS_QUERY_KEY, jobId];

// ============================== Update Job ==============================

// Separate fetch function
export const updateJob = async (
  jobId: string,
  input: UpdateJobInput
): Promise<UpdateJobResponse> => {
  const { data } = await axiosInstance.patch<UpdateJobResponse>(
    `/jobs/${jobId}`,
    input
  );
  return data;
};

// React Query mutation hook
export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, ...input }: UpdateJobInput & { jobId: string }) =>
      updateJob(jobId, input),
    onSuccess: (_, variables) => {
      // Invalidate specific job query
      queryClient.invalidateQueries({
        queryKey: [JOBS_QUERY_KEY, variables.jobId],
      });
      // Invalidate jobs list as well since job details have changed
      queryClient.invalidateQueries({
        queryKey: [JOBS_QUERY_KEY],
        exact: false,
      });
    },
  });
};

// ============================== Get User Jobs ==============================

// Separate fetch function
export const fetchUserJobs = async (
  userId: string,
  params: UserJobsQueryParams = {}
): Promise<JobsResponse> => {
  const { data } = await axiosInstance.get<JobsResponse>(
    `/jobs/user/${userId}`,
    {
      params: {
        page: params.page || 1,
        limit: params.limit || 20,
        status: params.status,
      },
    }
  );
  return data;
};

// React Query hook for user jobs
export const useUserJobs = (
  userId: string | undefined,
  params: UserJobsQueryParams = {}
) => {
  return useQuery({
    queryKey: [JOBS_QUERY_KEY, "user", userId, params],
    queryFn: () => fetchUserJobs(userId!, params),
    enabled: !!userId, // Only fetch when userId is provided
  });
};

// Helper function to construct the query key for user jobs
export const getUserJobsQueryKey = (
  userId: string,
  params: UserJobsQueryParams = {}
) => [JOBS_QUERY_KEY, "user", userId, params];

// ============================== Delete Job ==============================

// Separate fetch function
export const deleteJob = async (jobId: string): Promise<DeleteJobResponse> => {
  const { data } = await axiosInstance.delete<DeleteJobResponse>(
    `/jobs/${jobId}`
  );
  return data;
};

// React Query mutation hook
export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: (_, jobId) => {
      // Remove the job from cache
      queryClient.removeQueries({
        queryKey: [JOBS_QUERY_KEY, jobId],
      });
      // Invalidate jobs list to refetch
      queryClient.invalidateQueries({
        queryKey: [JOBS_QUERY_KEY],
        exact: false,
      });
    },
  });
};
