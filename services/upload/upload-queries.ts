import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/api/axios";
import {
  UploadFileInput,
  UploadFileResponse,
  // UploadMultipleFilesInput,
  // UploadMultipleFilesResponse,
  DeleteFileResponse,
} from "./upload-types";

const UPLOAD_QUERY_KEY = "uploads";

// ============================== Upload Single File ==============================

// Helper function to create FormData
const createUploadFormData = (input: UploadFileInput): FormData => {
  const formData = new FormData();
  formData.append("file", input.file);

  if (input.name) {
    formData.append("name", input.name);
  }

  if (input.folder) {
    formData.append("folder", input.folder);
  }

  if (input.description) {
    formData.append("description", input.description);
  }

  if (input.tags) {
    formData.append("tags", JSON.stringify(input.tags));
  }

  if (input.visibility) {
    formData.append("visibility", input.visibility);
  }

  return formData;
};

// Separate upload function
export const uploadFile = async (
  input: UploadFileInput
): Promise<UploadFileResponse> => {
  const formData = createUploadFormData(input);

  const { data } = await axiosInstance.post<UploadFileResponse>(
    "/upload/file",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// React Query mutation hook for file upload
export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      // Invalidate and refetch upload-related queries
      queryClient.invalidateQueries({
        queryKey: [UPLOAD_QUERY_KEY],
        exact: false,
        refetchType: "none",
      });
    },
  });
};

/* commented enpoint : upload multiple files 

// ============================== Upload Multiple Files ==============================

// Separate upload multiple files function
export const uploadMultipleFiles = async (
  input: UploadMultipleFilesInput
): Promise<UploadMultipleFilesResponse> => {
  const formData = new FormData();

  input.files.forEach((file) => {
    formData.append("files", file);
  });

  const { data } = await axiosInstance.post<UploadMultipleFilesResponse>(
    "/upload/files",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// React Query mutation hook for multiple files upload
export const useUploadMultipleFiles = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadMultipleFiles,
    onSuccess: () => {
      // Invalidate and refetch upload-related queries
      queryClient.invalidateQueries({
        queryKey: [UPLOAD_QUERY_KEY],
        exact: false,
        refetchType: "none",
      });
    },
  });
};

*/

// ============================== Delete File ==============================

// Separate delete function
export const deleteFile = async (key: string): Promise<DeleteFileResponse> => {
  const { data } = await axiosInstance.delete<DeleteFileResponse>(
    `/upload/file/${key}`
  );
  return data;
};

// React Query mutation hook for file deletion
export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      // Invalidate and refetch upload-related queries
      queryClient.invalidateQueries({
        queryKey: [UPLOAD_QUERY_KEY],
        exact: false,
        refetchType: "none",
      });
    },
  });
};
