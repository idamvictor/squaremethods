import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  FailureModesQueryParams,
  FailureModesResponse,
  CreateFailureModeInput,
  UpdateFailureModeInput,
  FailureModeResponse,
  DeleteFailureModeResponse,
  EquipmentFailureModesResponse,
} from "./failure-mode-types";

// Fetch function separate from the query
export const fetchFailureModes = async (
  params: FailureModesQueryParams = {}
) => {
  const { data } = await axiosInstance.get<FailureModesResponse>(
    "/failure-modes",
    {
      params,
    }
  );
  return data;
};

// Query function using the fetch function
export const useFailureModes = (params: FailureModesQueryParams = {}) => {
  return useQuery({
    queryKey: ["failure-modes", params],
    queryFn: () => fetchFailureModes(params),
  });
};

//================================================ Create failure mode ==================================================//

// Fetch function separate from the mutation
export const createFailureMode = async (input: CreateFailureModeInput) => {
  const { data } = await axiosInstance.post<FailureModeResponse>(
    "/failure-modes",
    input
  );
  return data;
};

// Mutation function using the fetch function
export const useCreateFailureMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFailureMode,
    onSuccess: () => {
      // Invalidate the failure modes list query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["failure-modes"] });
    },
  });
};

//================================================ Get failure mode details ==================================================//

// Fetch function separate from the query
export const fetchFailureModeDetails = async (id: string) => {
  const { data } = await axiosInstance.get<FailureModeResponse>(
    `/failure-modes/${id}`
  );
  return data;
};

// Query function using the fetch function
export const useFailureModeDetails = (id: string) => {
  return useQuery({
    queryKey: ["failure-mode", id],
    queryFn: () => fetchFailureModeDetails(id),
    enabled: !!id,
  });
};

//================================================ Update failure mode ==================================================//

// Fetch function separate from the mutation
export const updateFailureMode = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateFailureModeInput;
}) => {
  const { data: responseData } = await axiosInstance.put<FailureModeResponse>(
    `/failure-modes/${id}`,
    data
  );
  return responseData;
};

// Mutation function using the fetch function
export const useUpdateFailureMode = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFailureModeInput) =>
      updateFailureMode({ id, data }),
    onSuccess: () => {
      // Invalidate both the list and the detail queries
      queryClient.invalidateQueries({ queryKey: ["failure-modes"] });
      queryClient.invalidateQueries({ queryKey: ["failure-mode", id] });
    },
  });
};

//================================================ Delete failure mode ==================================================//

// Fetch function separate from the mutation
export const deleteFailureMode = async (id: string) => {
  const { data } = await axiosInstance.delete<DeleteFailureModeResponse>(
    `/failure-modes/${id}`
  );
  return data;
};

// Mutation function using the fetch function
export const useDeleteFailureMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFailureMode,
    onSuccess: () => {
      // Invalidate the failure modes list query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["failure-modes"] });
    },
  });
};

//================================================ Get equipment failure modes ==================================================//

// Fetch function separate from the query
export const fetchEquipmentFailureModes = async (equipmentId: string) => {
  const { data } = await axiosInstance.get<EquipmentFailureModesResponse>(
    `/failure-modes/equipment/${equipmentId}`
  );
  return data;
};

// Query function using the fetch function
export const useEquipmentFailureModes = (equipmentId: string) => {
  return useQuery({
    queryKey: ["equipment-failure-modes", equipmentId],
    queryFn: () => fetchEquipmentFailureModes(equipmentId),
    enabled: !!equipmentId,
  });
};
