import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  TasksQueryParams,
  TasksResponse,
  CreateTaskInput,
  CreateTaskResponse,
  TaskResponse,
  UpdateTaskInput,
  UpdateTaskResponse,
  DeleteTaskResponse,
} from "./tasks-types";

export const TASKS_QUERY_KEY = "tasks";

// ============================== List Company Tasks ==============================

// Separate fetch function
export const fetchTasks = async (
  params: TasksQueryParams = {}
): Promise<TasksResponse> => {
  const { data } = await axiosInstance.get<TasksResponse>("/tasks", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      search: params.search,
    },
  });
  return data;
};

// React Query hook using the fetch function
export const useTasks = (params: TasksQueryParams = {}) => {
  return useQuery<TasksResponse>({
    queryKey: [TASKS_QUERY_KEY, params],
    queryFn: () => fetchTasks(params),
  });
};

// ============================== Create New Task ==============================

// Separate fetch function
export const createTask = async (
  input: CreateTaskInput
): Promise<CreateTaskResponse> => {
  const { data } = await axiosInstance.post<CreateTaskResponse>(
    "/tasks",
    input
  );
  return data;
};

// React Query mutation hook
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      // Invalidate the tasks list query to refetch after creation
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] });
    },
  });
};

// ============================== Get Task by ID ==============================

// Separate fetch function
export const fetchTaskById = async (id: string): Promise<TaskResponse> => {
  const { data } = await axiosInstance.get<TaskResponse>(`/tasks/${id}`);
  return data;
};

// React Query hook for task details
export const useTaskById = (id: string | undefined) => {
  return useQuery<TaskResponse>({
    queryKey: [TASKS_QUERY_KEY, id],
    queryFn: () => fetchTaskById(id!),
    enabled: !!id, // Only fetch when id is provided
  });
};

// ============================== Update Task ==============================

// Separate fetch function
export const updateTask = async (
  id: string,
  input: UpdateTaskInput
): Promise<UpdateTaskResponse> => {
  const { data } = await axiosInstance.patch<UpdateTaskResponse>(
    `/tasks/${id}`,
    input
  );
  return data;
};

// React Query mutation hook
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateTaskInput & { id: string }) =>
      updateTask(id, input),
    onSuccess: (_, variables) => {
      // Invalidate specific task query
      queryClient.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, variables.id],
      });
      // Invalidate tasks list
      queryClient.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY],
        exact: false,
      });
    },
  });
};

// ============================== Delete Task ==============================

// Separate fetch function
export const deleteTask = async (id: string): Promise<DeleteTaskResponse> => {
  const { data } = await axiosInstance.delete<DeleteTaskResponse>(
    `/tasks/${id}`
  );
  return data;
};

// React Query mutation hook
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      // Remove the task from cache
      queryClient.removeQueries({ queryKey: [TASKS_QUERY_KEY, taskId] });
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY],
        exact: false,
      });
    },
  });
};
