"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { AxiosError } from "axios";
import { useStartJob, useCompleteJob } from "@/services/jobs/jobs-queries";
import { JobStatus } from "@/services/jobs/jobs-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface JobActionsProps {
  jobId: string;
  status: JobStatus;
  onActionComplete: () => void;
}

export function JobActions({
  jobId,
  status,
  onActionComplete,
}: JobActionsProps) {
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");

  const startJobMutation = useStartJob();
  const completeJobMutation = useCompleteJob();

  const handleStartJob = async () => {
    try {
      await startJobMutation.mutateAsync(jobId);
      toast.success("Job started successfully");
      onActionComplete();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage);
      } else {
        toast.error("Failed to start job");
      }
    }
  };

  const handleCompleteJob = async () => {
    try {
      await completeJobMutation.mutateAsync({
        jobId,
        completionNotes,
      });
      setIsCompleteDialogOpen(false);
      setCompletionNotes("");
      toast.success("Job completed successfully");
      onActionComplete();
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage);
      } else {
        toast.error("Failed to complete job");
      }
    }
  };

  const canStart = status === "pending";
  const canComplete = status === "in_progress";

  return (
    <div className="flex items-center gap-2">
      {canStart && (
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={handleStartJob}
          disabled={startJobMutation.isPending}
        >
          <PlayCircle className="h-4 w-4" />
          Start Job
        </Button>
      )}

      {canComplete && (
        <Button
          variant="secondary"
          size="sm"
          className="gap-2"
          onClick={() => setIsCompleteDialogOpen(true)}
          disabled={completeJobMutation.isPending}
        >
          <CheckCircle2 className="h-4 w-4" />
          Complete Job
        </Button>
      )}

      <AlertDialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide completion notes for this job.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Enter completion notes..."
              className="min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteJob}
              disabled={completeJobMutation.isPending}
            >
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
