"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, MoreVertical, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import {
  useInvitations,
  useRevokeInvitation,
} from "@/services/invitations/invitation-queries";
import { Invitation } from "@/services/invitations/invitation-types";
import { Skeleton } from "@/components/ui/skeleton";

export function InvitationsList() {
  const [page, setPage] = useState(1);
  const [invitationToDelete, setInvitationToDelete] = useState<string | null>(
    null
  );

  const {
    data: invitationsData,
    isLoading,
    error,
  } = useInvitations({
    page,
    limit: 10,
  });

  const revokeInvitationMutation = useRevokeInvitation();

  const handleCopyLink = async (token: string) => {
    try {
      const link = `${window.location.origin}/invite?token=${token}`;
      await navigator.clipboard.writeText(link);
      toast("Invitation link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast("Failed to copy link");
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await revokeInvitationMutation.mutateAsync(id);
      toast("Invitation revoked successfully");
      setInvitationToDelete(null);
    } catch (err) {
      console.error("Failed to revoke invitation:", err);
      toast("Failed to revoke invitation");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading invitations</p>
      </div>
    );
  }

  const invitations = invitationsData?.data || [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Active Invitations</h2>
        <span className="text-sm text-gray-500">
          {invitationsData?.pagination.total || 0} total
        </span>
      </div>

      {/* Table */}
      {invitations.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Created By</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation: Invitation) => (
                <TableRow key={invitation.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {invitation.creator?.avatar_url && (
                        <Image
                          src={invitation.creator.avatar_url}
                          alt={invitation.creator.first_name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div className="text-sm">
                        <div className="font-medium">
                          {invitation.creator?.first_name}{" "}
                          {invitation.creator?.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {invitation.creator?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {formatRole(invitation.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {invitation.emails ? (
                        <div className="space-y-1">
                          {invitation.emails.map((email) => (
                            <div key={email} className="text-gray-700">
                              {email}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">
                          Public link
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(invitation.expires_at)}
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div className="text-gray-700">
                        {invitation.used_count}{" "}
                        {invitation.max_uses ? `of ${invitation.max_uses}` : ""}{" "}
                        used
                      </div>
                      <div className="text-gray-500">
                        {new Date(invitation.expires_at) < new Date()
                          ? "Expired"
                          : "Active"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleCopyLink(invitation.token)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setInvitationToDelete(invitation.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg bg-gray-50">
          <p className="text-gray-500">No active invitations yet</p>
        </div>
      )}

      {/* Pagination */}
      {invitationsData && invitationsData.pagination.pages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-500">
            Page {page} of {invitationsData.pagination.pages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage(Math.min(invitationsData.pagination.pages, page + 1))
              }
              disabled={page === invitationsData.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {invitationToDelete && (
        <AlertDialog
          open={!!invitationToDelete}
          onOpenChange={(open) => !open && setInvitationToDelete(null)}
        >
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
              <h3 className="text-lg font-semibold mb-2">Revoke Invitation</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to revoke this invitation? This action
                cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setInvitationToDelete(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRevoke(invitationToDelete)}
                  disabled={revokeInvitationMutation.isPending}
                >
                  {revokeInvitationMutation.isPending
                    ? "Revoking..."
                    : "Revoke"}
                </Button>
              </div>
            </div>
          </div>
        </AlertDialog>
      )}
    </div>
  );
}
