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
import { TeamMember } from "@/services/teams/teams-types";

interface RemoveMemberModalProps {
  member: TeamMember;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (memberId: string) => void;
  isLoading?: boolean;
}

export function RemoveMemberModal({
  member,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: RemoveMemberModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Team Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove {member.first_name}{" "}
            {member.last_name} from the team? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => onConfirm(member.id)}
            disabled={isLoading}
          >
            {isLoading ? "Removing..." : "Remove Member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
