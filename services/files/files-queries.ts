import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import { FilesResponse } from "./files-types";

interface FetchFilesParams {
  page?: number;
  limit?: number;
}

//========================================= Get All Files =========================================//

// Separate fetch function
export const fetchFiles = async ({
  page = 1,
  limit = 10,
}: FetchFilesParams = {}) => {
  const response = await axiosInstance.get<FilesResponse>(
    `/files?page=${page}&limit=${limit}`,
    {
      skipToast: true,
    }
  );
  return response.data;
};

// Query hook that uses the fetch function
export const useFiles = (params: FetchFilesParams = {}) => {
  return useQuery({
    queryKey: ["files", params],
    queryFn: () => fetchFiles(params),
  });
};
