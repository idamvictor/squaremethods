"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useJobById, useUpdateJob } from "@/services/jobs/jobs-queries";
import { JobPriority } from "@/services/jobs/jobs-types";

interface JobEditModalProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobEditModal({ jobId, isOpen, onClose }: JobEditModalProps) {
  const { data: job, isLoading: isLoadingJob } = useJobById(jobId || undefined);
  const updateJobMutation = useUpdateJob();

  const [formData, setFormData] = useState({
    title: "",
    priority: "medium" as JobPriority,
    due_date: new Date(),
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        priority: (job.priority || "medium") as JobPriority,
        due_date: new Date(job.due_date),
      });
    }
  }, [job]);

  const handleSave = async () => {
    if (!jobId || !formData.title) return;

    try {
      await updateJobMutation.mutateAsync({
        jobId,
        title: formData.title,
        priority: formData.priority,
        due_date: formData.due_date.toISOString(),
      });
      onClose();
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        {isLoadingJob ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input
                id="job-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter job title"
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value as JobPriority })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="due-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.due_date && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.due_date
                      ? format(formData.due_date, "MMM dd, yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, due_date: date })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoadingJob}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isLoadingJob || updateJobMutation.isPending || !formData.title
            }
          >
            {updateJobMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
