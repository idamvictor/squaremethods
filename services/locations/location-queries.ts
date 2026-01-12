import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  LocationsResponse,
  LocationResponse,
  LocationsQueryParams,
  CreateLocationInput,
  CreateLocationResponse,
  UpdateLocationInput,
  UpdateLocationResponse,
  DeleteLocationResponse,
} from "./location-types";

const LOCATIONS_QUERY_KEY = "locations";

// ============================== Get all Locations ==============================

// Separate fetch function
export const fetchLocations = async (
  params: LocationsQueryParams = {}
): Promise<LocationsResponse> => {
  const { data } = await axiosInstance.get<LocationsResponse>("/locations", {
    params: {
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search,
      sortBy: params.sortBy || "created_at",
      sortOrder: params.sortOrder || "DESC",
      tree: params.tree || true,
    },
    skipToast: true,
  });
  return data;
};

// React Query hook using the fetch function
export const useLocations = (params: LocationsQueryParams = {}) => {
  return useQuery({
    queryKey: [LOCATIONS_QUERY_KEY, params],
    queryFn: () => fetchLocations(params),
  });
};

// Helper function to construct the query key for locations
export const getLocationsQueryKey = (params: LocationsQueryParams = {}) => [
  LOCATIONS_QUERY_KEY,
  params,
];

// =============================== Create A New Location ===============================

// Separate create function
export const createLocation = async (
  input: CreateLocationInput
): Promise<CreateLocationResponse> => {
  const { data } = await axiosInstance.post<CreateLocationResponse>(
    "/locations",
    input
  );
  return data;
};

// React Query mutation hook
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => {
      // Invalidate and refetch the locations list
      queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] });
    },
  });
};

//=================================== Get Location List With Equipment ==============================

// Separate fetch function for locations with equipment
export const fetchLocationsWithEquipment =
  async (): Promise<LocationsResponse> => {
    const { data } = await axiosInstance.get<LocationsResponse>(
      "/locations/list",
      {
        skipToast: true,
      }
    );
    return data;
  };

// React Query hook for locations with equipment
export const useLocationsWithEquipment = () => {
  return useQuery({
    queryKey: [LOCATIONS_QUERY_KEY, "with-equipment"],
    queryFn: fetchLocationsWithEquipment,
  });
};

// ============================== Get Location by ID ==============================

// Separate fetch function
export const fetchLocationById = async (
  id: string
): Promise<LocationResponse> => {
  const { data } = await axiosInstance.get<LocationResponse>(
    `/locations/${id}`,
    {
      skipToast: true,
    }
  );
  return data;
};

// React Query hook for getting location by ID
export const useLocationById = (id: string | undefined) => {
  return useQuery({
    queryKey: [LOCATIONS_QUERY_KEY, "detail", id],
    queryFn: () => fetchLocationById(id!),
    enabled: !!id, // Only fetch when ID is provided
  });
};

// Helper function to construct the query key for location detail
export const getLocationByIdQueryKey = (id: string) => [
  LOCATIONS_QUERY_KEY,
  "detail",
  id,
];

// ============================== Update Location ==============================

// Separate update function
export const updateLocation = async (
  id: string,
  input: UpdateLocationInput
): Promise<UpdateLocationResponse> => {
  const { data } = await axiosInstance.put<UpdateLocationResponse>(
    `/locations/${id}`,
    input
  );
  return data;
};

// React Query mutation hook for updating location
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: UpdateLocationInput & { id: string }) => {
      const result = await updateLocation(id, input);
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific location query
      queryClient.invalidateQueries({
        queryKey: getLocationByIdQueryKey(variables.id),
      });
      // Invalidate locations list and locations with equipment
      queryClient.invalidateQueries({
        queryKey: [LOCATIONS_QUERY_KEY],
        exact: false,
      });
    },
  });
};

// ============================== Delete Location ==============================

// Separate delete function
export const deleteLocation = async (
  id: string
): Promise<DeleteLocationResponse> => {
  const { data } = await axiosInstance.delete<DeleteLocationResponse>(
    `/locations/${id}`
  );
  return data;
};

// React Query mutation hook for deleting location
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteLocation(id);
      return result;
    },
    onSuccess: (_, id) => {
      // Remove the location from cache
      queryClient.removeQueries({
        queryKey: getLocationByIdQueryKey(id),
      });
      // Invalidate locations list and locations with equipment
      queryClient.invalidateQueries({
        queryKey: [LOCATIONS_QUERY_KEY],
        exact: false,
      });
    },
  });
};
