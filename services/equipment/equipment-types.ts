export interface Equipment {
  id: string;
  equipment_type_id: string;
  name: string;
  slug: string;
  reference_code: string;
  status: "draft" | string; // Add other status types as needed
  location_id: string;
  image: string;
  icon: string;
  documents: string[];
  notes: string;
  qrcode: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EquipmentResponse {
  success: boolean;
  data: Equipment[];
  meta: EquipmentMeta;
}

export interface EquipmentQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  location_id?: string;
  equipment_type_id?: string;
  search?: string;
}

export interface CreateEquipmentInput {
  equipment_type_id: string;
  location_id: string;
  name: string;
  reference_code: string;
  notes: string;
  status: string;
}

export interface UpdateEquipmentInput {
  name?: string;
  notes?: string;
  status?: string;
}

export interface EquipmentQRCode {
  qrCodeUrl: string;
  scanUrl: string;
}

export interface EquipmentQRCodeResponse {
  success: boolean;
  data: EquipmentQRCode;
}

export interface GetEquipmentResponse {
  success: boolean;
  message: string;
  data: Equipment;
}

export interface DeleteEquipmentResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
}

export interface ScanEquipmentResponse {
  success: boolean;
  message: string;
  data: Equipment;
}

export interface EquipmentStats {
  total: number;
  published: number;
  draft: number;
  withQR: number;
  withImages: number;
}

export interface EquipmentStatsResponse {
  success: boolean;
  data: EquipmentStats;
}

export interface CreateEquipmentResponse {
  success: boolean;
  message: string;
  data: Equipment;
}
