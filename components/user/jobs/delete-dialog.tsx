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

interface DeleteDialogProps {
  isOpen: boolean;
  jobId: string | null;
  onClose: () => void;
  onConfirm: (jobId: string) => void;
  isDeleting?: boolean;
}

export function DeleteDialog({
  isOpen,
  jobId,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this job?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the job
            and remove all associated data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => jobId && onConfirm(jobId)}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
