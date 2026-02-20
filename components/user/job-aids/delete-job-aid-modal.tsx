"use client";

import { Button } from "@/components/ui/button";

interface DeleteJobAidModalProps {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteJobAidModal({
  open,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteJobAidModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Job Aid
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure you want to delete this job aid? This action cannot be
            undone.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}
