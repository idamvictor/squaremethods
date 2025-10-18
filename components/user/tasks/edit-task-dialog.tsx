"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateTask } from "@/services/tasks/tasks-queries";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface EditTaskDialogProps {
  task: {
    id: string;
    title: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTaskDialog({ task, isOpen, onClose }: EditTaskDialogProps) {
  const [title, setTitle] = useState(task?.title || "");
  const updateTaskMutation = useUpdateTask();

  const handleSave = async () => {
    if (!task) return;

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        name: title,
      });
      toast.success("Task updated successfully");
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Failed to update task";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Update task error:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || updateTaskMutation.isPending}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
