export interface Uploader {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar_url: string;
}

export interface FileMetadata {
  width?: number;
  height?: number;
  [key: string]: number | undefined;
}

export interface UploadedFile {
  id: string;
  name: string;
  original_name: string;
  s3_key: string;
  url: string;
  file_type: string;
  mime_type: string;
  size: number;
  status: string;
  visibility: string;
  download_count: number;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  folder: string;
  description: string;
  tags: string[];
  metadata: FileMetadata;
  last_accessed: string;
  file_extension: string;
  file_category: string;
  formatted_size: string;
  uploader: Uploader;
}

export interface UploadFileResponse {
  success: boolean;
  message: string;
  data: UploadedFile;
}

export interface UploadFileInput {
  file: File;
  name?: string;
  folder?: string;
  description?: string;
  tags?: string[];
  visibility?: string;
}

export interface UploadedMultipleFilesResult {
  url: string;
  key: string;
  originalName: string;
  size: number;
  mimetype: string;
}

export interface UploadMultipleFilesResponse {
  success: boolean;
  message: string;
  data: UploadedMultipleFilesResult[];
}

export interface DeleteFileResponse {
  success: boolean;
  message: string;
}

export interface UploadMultipleFilesInput {
  files: File[];
}
