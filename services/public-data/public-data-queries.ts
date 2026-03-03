import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetPublicEquipmentResponse } from "./public-data-types";

const PUBLIC_DATA_QUERY_KEY = "public-data";

const COMPANY_ID = "chowdeck";

// Create a separate axios instance for public endpoints (no auth required)
const publicAxiosInstance = axios.create({
  baseURL: "https://api.squaremethods.com/api",
  headers: {
    "Content-Type": "application/json",
    "X-Company-ID": COMPANY_ID,
  },
});

// ============================== Get Public Equipment Details ==============================

// Separate fetch function
export const fetchPublicEquipmentDetails = async (
  id: string,
): Promise<GetPublicEquipmentResponse> => {
  const { data } = await publicAxiosInstance.get<GetPublicEquipmentResponse>(
    `/data/equipment/${id}`,
  );
  return data;
};

// React Query hook for public equipment details
export const usePublicEquipmentDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: [PUBLIC_DATA_QUERY_KEY, "equipment", id],
    queryFn: () => fetchPublicEquipmentDetails(id!),
    enabled: !!id, // Only fetch when ID is provided
  });
};
