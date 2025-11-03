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
import { useDeleteFailureMode } from "@/services/failure-mode/failure-mode-queries";

interface DeleteConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  failureModeId: string;
  failureModeTitle: string;
}

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  failureModeId,
  failureModeTitle,
}: DeleteConfirmationModalProps) {
  const { mutate: deleteFailureMode, isPending } = useDeleteFailureMode();

  const handleDelete = () => {
    deleteFailureMode(failureModeId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Failure Mode</DialogTitle>
          <DialogDescription>
            This will permanently delete the failure mode &quot;
            {failureModeTitle}&quot;. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
