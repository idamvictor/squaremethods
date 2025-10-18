"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTaskDialog({ isOpen, onClose }: NewTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [attachedJob, setAttachedJob] = useState<string | null>(null);

  const handleCreateTask = () => {
    console.log("Creating task:", { taskTitle, attachedJob });
    setTaskTitle("");
    setAttachedJob(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Checkbox id="task-checkbox" />
            <DialogTitle>New Task</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Title Input */}
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-medium">
              Task Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Enter task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Attach Job Button */}
          <button
            onClick={() => setAttachedJob("Job added")}
            className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
          >
            <span className="flex items-center gap-2 text-gray-600">
              <span>📎</span>
              Attach Job add
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </button>

          {/* Create Task Button */}
          <Button
            onClick={handleCreateTask}
            className="w-full bg-blue-900 hover:bg-blue-800"
          >
            Create Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
