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
import { ArrowRight, Minus } from "lucide-react";
import { SelectableJobAidTable } from "../job-aids/selectable-job-aid-table";
import { useCreateTask } from "@/services/tasks/tasks-queries";
import { useJobAids } from "@/services/job-aid/job-aid-queries";
import { toast } from "sonner";

interface NewTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewTaskDialog({ isOpen, onClose }: NewTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [showJobAids, setShowJobAids] = useState(false);
  const [selectedJobAids, setSelectedJobAids] = useState<string[]>([]);
  const createTaskMutation = useCreateTask();
  const { data: jobAidsData } = useJobAids({
    page: 1,
    limit: 100,
  });

  const handleCreateTask = async () => {
    if (!taskTitle) {
      toast.error("Please enter a task title");
      return;
    }

    if (selectedJobAids.length === 0) {
      toast.error("Please select at least one job aid");
      return;
    }

    try {
      await createTaskMutation.mutateAsync({
        title: taskTitle,
        job_aid_ids: selectedJobAids,
      });

      toast.success("Task created successfully");
      setTaskTitle("");
      setSelectedJobAids([]);
      onClose();
    } catch (error) {
      toast.error(
        "Failed to create task: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const handleRemoveJobAid = (jobAidId: string) => {
    setSelectedJobAids((prevIds) => prevIds.filter((id) => id !== jobAidId));
  };

  const selectedJobAidDetails =
    jobAidsData?.data.filter((jobAid) => selectedJobAids.includes(jobAid.id)) ||
    [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={showJobAids ? "sm:max-w-4xl" : "sm:max-w-md"}>
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

          {/* Selected Job Aids List */}
          {selectedJobAidDetails.length > 0 && !showJobAids && (
            <div className="space-y-2">
              {selectedJobAidDetails.map((jobAid) => (
                <div
                  key={jobAid.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <Checkbox checked={true} />
                    <span className="text-sm font-medium">{jobAid.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveJobAid(jobAid.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Attach Job Button or Table */}
          {!showJobAids ? (
            <button
              onClick={() => setShowJobAids(true)}
              className="flex w-full items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <span className="flex items-center gap-2 text-gray-600">
                <span>📎</span>
                {selectedJobAids.length === 0
                  ? "Attached Job aid"
                  : "Add more job aids"}
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </button>
          ) : (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Select Job Aids <span className="text-red-500">*</span>
              </Label>
              <SelectableJobAidTable
                selectedIds={selectedJobAids}
                onSelectionChange={setSelectedJobAids}
              />
              <Button
                variant="outline"
                onClick={() => setShowJobAids(false)}
                className="mt-2"
              >
                Done Selecting
              </Button>
            </div>
          )}

          {/* Create Task Button */}
          <Button
            onClick={handleCreateTask}
            className="w-full bg-blue-900 hover:bg-blue-800"
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
