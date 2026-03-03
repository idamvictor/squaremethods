import {
  EquipmentType,
  Location,
  JobAid,
  FailureMode,
} from "@/services/equipment/equipment-types";

export interface PublicEquipment {
  id: string;
  equipment_type_id: string;
  location_id: string;
  name: string;
  slug: string;
  reference_code: string;
  image: string | null;
  icon: string | null;
  documents: string[] | null;
  notes: string;
  status: "draft" | string;
  qrcode: string | null;
  created_at: string;
  updated_at: string;
  equipmentType: EquipmentType;
  location: Location;
  jobAids: JobAid[];
  failureModes: FailureMode[];
}

export interface GetPublicEquipmentResponse {
  status: "success" | string;
  data: PublicEquipment;
}
