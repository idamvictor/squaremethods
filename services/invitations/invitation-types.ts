export interface Creator {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  avatar_url: string;
}

export interface Invitation {
  id: string;
  token: string;
  emails: string[] | null;
  role: "editor" | "viewer";
  created_by: string;
  expires_at: string;
  used_count: number;
  max_uses: number | null;
  creator: Creator;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface InvitationsResponse {
  status: "success";
  data: Invitation[];
  pagination: PaginationInfo;
}

export interface InvitationResponse {
  status: "success";
  data: Invitation;
}

export interface SendInvitationRequest {
  emails: string[];
  role: "editor" | "viewer";
  expires_in_days: number;
}

export interface SendInvitationResponse {
  status: "success";
  data: {
    id: string;
    token: string;
    link: string;
    role: "editor" | "viewer";
    sent_to: string[];
    expires_at: string;
  };
  message: string;
}

export interface GenerateInvitationLinkRequest {
  emails: string[];
  role: "editor" | "viewer";
  expires_in_days: number;
  max_uses?: number;
}

export interface GenerateInvitationLinkResponse {
  status: "success";
  data: {
    id: string;
    token: string;
    link: string;
    role: "editor" | "viewer";
    emails: string[];
    expires_at: string;
    max_uses: number;
  };
  message: string;
}

export interface RevokeInvitationResponse {
  success: true;
  message: string;
  data: Record<string, never>;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
}

export interface ValidateInvitationResponse {
  status: "success";
  data: {
    valid: boolean;
    role: "editor" | "viewer";
    expires_at: string;
    company: Company;
  };
}
