import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  EquipmentTypesResponse,
  EquipmentTypesQueryParams,
  CreateEquipmentTypeInput,
  CreateEquipmentTypeResponse,
  DefaultEquipmentTypesResponse,
  EquipmentTypeResponse,
  UpdateEquipmentTypeInput,
  UpdateEquipmentTypeResponse,
  DeleteEquipmentTypeResponse,
} from "./equipment-types-types";

const EQUIPMENT_TYPES_QUERY_KEY = "equipment-types";

// ============================== Get all Equipment Types ==============================

// Separate fetch function
export const fetchEquipmentTypes = async (
  params: EquipmentTypesQueryParams = {}
): Promise<EquipmentTypesResponse> => {
  const { data } = await axiosInstance.get<EquipmentTypesResponse>(
    "/equipment-types",
    {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        sortBy: params.sortBy || "created_at",
        sortOrder: params.sortOrder || "DESC",
      },
    }
  );
  return data;
};

// React Query hook using the fetch function
export const useEquipmentTypes = (params: EquipmentTypesQueryParams = {}) => {
  return useQuery({
    queryKey: [EQUIPMENT_TYPES_QUERY_KEY, params],
    queryFn: () => fetchEquipmentTypes(params),
  });
};

// ============================== Create a new Equipment Type ==============================

// Separate create function
export const createEquipmentType = async (
  input: CreateEquipmentTypeInput
): Promise<CreateEquipmentTypeResponse> => {
  const { data } = await axiosInstance.post<CreateEquipmentTypeResponse>(
    "/equipment-types",
    input
  );
  return data;
};

// React Query mutation hook
export const useCreateEquipmentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEquipmentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EQUIPMENT_TYPES_QUERY_KEY] });
    },
  });
};

// ============================== Create Default Equipment Types ==============================

// Separate create default function
export const createDefaultEquipmentTypes =
  async (): Promise<DefaultEquipmentTypesResponse> => {
    const { data } = await axiosInstance.post<DefaultEquipmentTypesResponse>(
      "/equipment-types/default"
    );
    return data;
  };

// React Query mutation hook
export const useCreateDefaultEquipmentTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDefaultEquipmentTypes,
    onSuccess: () => {
      // Invalidate and refetch equipment types queries
      queryClient.invalidateQueries({ queryKey: [EQUIPMENT_TYPES_QUERY_KEY] });
    },
  });
};

// ============================== Get Equipment Type by ID ==============================

// Separate fetch function
export const fetchEquipmentTypeById = async (
  id: string
): Promise<EquipmentTypeResponse> => {
  const { data } = await axiosInstance.get<EquipmentTypeResponse>(
    `/equipment-types/${id}`
  );
  return data;
};

// React Query hook for getting equipment type by ID
export const useEquipmentTypeById = (id: string | undefined) => {
  return useQuery({
    queryKey: [EQUIPMENT_TYPES_QUERY_KEY, id],
    queryFn: () => fetchEquipmentTypeById(id!),
    enabled: !!id, // Only fetch when ID is provided
  });
};

// ============================== Update Equipment Type ==============================

// Separate update function
export const updateEquipmentType = async (
  id: string,
  input: UpdateEquipmentTypeInput
): Promise<UpdateEquipmentTypeResponse> => {
  const { data } = await axiosInstance.patch<UpdateEquipmentTypeResponse>(
    `/equipment-types/${id}`,
    input
  );
  return data;
};

// React Query mutation hook
export const useUpdateEquipmentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateEquipmentTypeInput & { id: string }) =>
      updateEquipmentType(id, input),
    onSuccess: (_, variables) => {
      // Invalidate specific equipment type query
      queryClient.invalidateQueries({
        queryKey: [EQUIPMENT_TYPES_QUERY_KEY, variables.id],
      });
      // Invalidate equipment types list
      queryClient.invalidateQueries({
        queryKey: [EQUIPMENT_TYPES_QUERY_KEY],
        exact: true,
      });
    },
  });
};

// ============================== Delete Equipment Type ==============================

// Separate delete function
export const deleteEquipmentType = async (
  id: string
): Promise<DeleteEquipmentTypeResponse> => {
  const { data } = await axiosInstance.delete<DeleteEquipmentTypeResponse>(
    `/equipment-types/${id}`
  );
  return data;
};

// React Query mutation hook
export const useDeleteEquipmentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEquipmentType,
    onSuccess: (_, id) => {
      // Remove the deleted equipment type from cache
      queryClient.removeQueries({
        queryKey: [EQUIPMENT_TYPES_QUERY_KEY, id],
      });
      // Invalidate equipment types list
      queryClient.invalidateQueries({
        queryKey: [EQUIPMENT_TYPES_QUERY_KEY],
        exact: true,
      });
    },
  });
};
