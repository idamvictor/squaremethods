export interface Equipment {
  id: string;
  name: string;
  reference_code: string;
  image: string | null;
  status: string;
}

export interface Location {
  id: string;
  name: string;
  icon: string | null;
  slug: string;
  parent_location_id: string | null;
  created_at: string;
  updated_at: string;
  equipment: Equipment[];
  children: Location[];
}

export interface LocationsResponse {
  status: string;
  data: Location[];
  message: string;
}

export interface LocationResponse {
  status: string;
  data: Location & {
    parent: Location | null;
  };
  message: string;
}

export interface LocationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "DESC" | "ASC";
  tree?: boolean;
}

export interface CreateLocationInput {
  name: string;
  icon?: string;
  parent_location_id?: string;
}

export interface DeleteLocationResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface UpdateLocationInput {
  name?: string;
  icon?: string | null;
  parent_location_id?: string | null;
}

export interface UpdateLocationResponse {
  status: string;
  data: Location;
  message: string;
}

export interface CreateLocationResponse {
  success: boolean;
  message: string;
  data: Location;
}
