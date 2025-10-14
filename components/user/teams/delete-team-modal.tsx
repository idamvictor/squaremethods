"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTeam } from "@/services/teams/teams";
import { Team } from "@/services/teams/teams-types";
import { useRouter } from "next/navigation";

interface DeleteTeamModalProps {
  team: Team;
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteTeamModal({
  team,
  isOpen,
  onClose,
}: DeleteTeamModalProps) {
  const router = useRouter();
  const deleteTeamMutation = useDeleteTeam();

  const handleDelete = async () => {
    try {
      await deleteTeamMutation.mutateAsync(team.id);
      onClose();
      router.push("/teams"); // Redirect to teams list after deletion
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Team</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this team? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteTeamMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTeamMutation.isPending}
          >
            {deleteTeamMutation.isPending ? "Deleting..." : "Delete Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
