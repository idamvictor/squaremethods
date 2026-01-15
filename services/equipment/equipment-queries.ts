import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  EquipmentResponse,
  EquipmentQueryParams,
  CreateEquipmentInput,
  CreateEquipmentResponse,
  EquipmentStatsResponse,
  EquipmentQRCodeResponse,
  ScanEquipmentResponse,
  GetEquipmentResponse,
  UpdateEquipmentInput,
  DeleteEquipmentResponse,
} from "./equipment-types";

const EQUIPMENT_QUERY_KEY = "equipment";

// ============================== List Company Equipment ==============================

// Separate fetch function
export const fetchEquipment = async (
  params: EquipmentQueryParams = {}
): Promise<EquipmentResponse> => {
  const { data } = await axiosInstance.get<EquipmentResponse>("/equipment", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      status: params.status,
      location_id: params.location_id,
      equipment_type_id: params.equipment_type_id,
      search: params.search,
    },
  });
  return data;
};

// React Query hook using the fetch function
export const useEquipment = (params: EquipmentQueryParams = {}) => {
  return useQuery({
    queryKey: [EQUIPMENT_QUERY_KEY, params],
    queryFn: () => fetchEquipment(params),
  });
};

// ============================== Create Equipment ==============================

// Separate create function
export const createEquipment = async (
  input: CreateEquipmentInput
): Promise<CreateEquipmentResponse> => {
  const { data } = await axiosInstance.post<CreateEquipmentResponse>(
    "/equipment",
    input
  );
  return data;
};

// React Query mutation hook
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      // Invalidate equipment list queries
      queryClient.invalidateQueries({ queryKey: [EQUIPMENT_QUERY_KEY] });
    },
  });
};

// ============================== Get Equipment Statistics ==============================

// Separate fetch function
export const fetchEquipmentStats =
  async (): Promise<EquipmentStatsResponse> => {
    const { data } = await axiosInstance.get<EquipmentStatsResponse>(
      "/equipment/stats"
    );
    return data;
  };

// React Query hook for statistics
export const useEquipmentStats = () => {
  return useQuery({
    queryKey: [EQUIPMENT_QUERY_KEY, "stats"],
    queryFn: fetchEquipmentStats,
  });
};

// ============================== Get Equipment QR Code ==============================

// Separate fetch function
export const fetchEquipmentQRCode = async (
  id: string
): Promise<EquipmentQRCodeResponse> => {
  const { data } = await axiosInstance.get<EquipmentQRCodeResponse>(
    `/equipment/${id}/qrcode`
  );
  return data;
};

// React Query hook for QR code
export const useEquipmentQRCode = (id: string | undefined) => {
  return useQuery({
    queryKey: [EQUIPMENT_QUERY_KEY, id, "qrcode"],
    queryFn: () => fetchEquipmentQRCode(id!),
    enabled: !!id, // Only fetch when ID is provided
  });
};

// ============================== Generate Equipment QR Code ==============================

// Separate generate function
export const generateEquipmentQRCode = async (
  id: string
): Promise<EquipmentQRCodeResponse> => {
  const { data } = await axiosInstance.post<EquipmentQRCodeResponse>(
    `/equipment/${id}/qrcode`
  );
  return data;
};

// React Query mutation hook for QR code generation
export const useGenerateEquipmentQRCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateEquipmentQRCode,
    onSuccess: (_, id) => {
      // Invalidate equipment QR code query
      queryClient.invalidateQueries({
        queryKey: [EQUIPMENT_QUERY_KEY, id, "qrcode"],
      });
      // Invalidate equipment stats query since withQR count will change
      queryClient.invalidateQueries({
        queryKey: [EQUIPMENT_QUERY_KEY, "stats"],
      });
    },
  });
};

// ============================== Scan Equipment QR Code ==============================

// Separate scan function
export const scanEquipmentQRCode = async (
  id: string
): Promise<ScanEquipmentResponse> => {
  const { data } = await axiosInstance.post<ScanEquipmentResponse>(
    `/equipment/${id}/scan`
  );
  return data;
};

// React Query mutation hook for QR code scanning
export const useScanEquipmentQRCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scanEquipmentQRCode,
    onSuccess: (response) => {
      // Add the scanned equipment data to the cache
      queryClient.setQueryData([EQUIPMENT_QUERY_KEY, response.data.id], {
        success: true,
        data: response.data,
      });
    },
  });
};

// ============================== Get Equipment Details ==============================

// Separate fetch function
export const fetchEquipmentDetails = async (
  id: string
): Promise<GetEquipmentResponse> => {
  const { data } = await axiosInstance.get<GetEquipmentResponse>(
    `/equipment/${id}`
  );
  return data;
};

// React Query hook for equipment details
export const useEquipmentDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: [EQUIPMENT_QUERY_KEY, id],
    queryFn: () => fetchEquipmentDetails(id!),
    enabled: !!id, // Only fetch when ID is provided
  });
};

// ============================== Update Equipment ==============================

// Separate update function
export const updateEquipment = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateEquipmentInput;
}): Promise<GetEquipmentResponse> => {
  const { data: responseData } = await axiosInstance.put<GetEquipmentResponse>(
    `/equipment/${id}`,
    data
  );
  return responseData;
};

// React Query mutation hook for updating equipment
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEquipment,
    onSuccess: (response, { id }) => {
      // Invalidate equipment details query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: [EQUIPMENT_QUERY_KEY, id],
      });

      // Invalidate the equipment list query since the equipment details might have changed
      queryClient.invalidateQueries({
        queryKey: [EQUIPMENT_QUERY_KEY],
        exact: false,
        refetchType: "none",
      });
    },
  });
};

// ============================== Delete Equipment ==============================

// Separate delete function
export const deleteEquipment = async (
  id: string
): Promise<DeleteEquipmentResponse> => {
  const { data } = await axiosInstance.delete<DeleteEquipmentResponse>(
    `/equipment/${id}`
  );
  return data;
};

// React Query mutation hook for deleting equipment
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEquipment,
    onSuccess: (_, id) => {
      // Remove the equipment from the cache
      queryClient.removeQueries({
        queryKey: [EQUIPMENT_QUERY_KEY, id],
      });

      // Invalidate the equipment list and stats queries
      queryClient.invalidateQueries({
        queryKey: [EQUIPMENT_QUERY_KEY],
        exact: false,
        refetchType: "none",
      });
    },
  });
};
