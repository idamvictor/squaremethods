import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useJobById, JOBS_QUERY_KEY } from "@/services/jobs/jobs-queries";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { avatarImage } from "@/constants/images";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { JobActions } from "./job-actions";
import { useRouter } from "next/navigation";

interface JobDetailsModalProps {
  jobId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function JobDetailsModal({
  jobId,
  isOpen,
  onClose,
}: JobDetailsModalProps) {
  const { data: job, isLoading } = useJobById(jobId || undefined);
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks?taskId=${taskId}`);
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-yellow-500";
      case "on_hold":
        return "bg-orange-500";
      default:
        return "bg-red-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : job ? (
          <>
            <DialogHeader>
              <div className="space-y-4">
                <DialogTitle className="text-2xl font-bold">
                  {job.title || "Untitled Job"}
                </DialogTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {job.status && (
                      <Badge
                        variant="secondary"
                        className={`${getStatusColor(
                          job.status || "pending"
                        )} text-white`}
                      >
                        {(job.status || "pending")
                          .replace("_", " ")
                          .toUpperCase()}
                      </Badge>
                    )}
                    {job.priority && (
                      <Badge
                        variant="secondary"
                        className={`${getPriorityColor(
                          job.priority
                        )} text-white`}
                      >
                        {job.priority.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  {/* Job Actions */}
                  {job.id && (
                    <JobActions
                      jobId={job.id}
                      status={job.status || "pending"}
                      onActionComplete={() => {
                        queryClient.invalidateQueries({
                          queryKey: [JOBS_QUERY_KEY, jobId],
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Description */}
              {job.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{job.description}</p>
                </div>
              )}

              {/* Assignment Details */}
              <div className="grid grid-cols-2 gap-6">
                {job.assignedUser && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Assigned To</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={avatarImage.image1}
                          alt={`${job.assignedUser.first_name} ${job.assignedUser.last_name}`}
                        />
                      </Avatar>
                      <span>{`${job.assignedUser.first_name} ${job.assignedUser.last_name}`}</span>
                    </div>
                  </div>
                )}
                {job.team && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Team</h3>
                    <p>{job.team.name}</p>
                  </div>
                )}
              </div>

              {/* Timing Details */}
              <div className="grid grid-cols-2 gap-6">
                {job.due_date && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Due Date</h3>
                    <p>{formatDate(job.due_date)}</p>
                  </div>
                )}
                {job.created_at && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Created</h3>
                    <p>{formatDate(job.created_at)}</p>
                  </div>
                )}
              </div>

              {/* Duration */}
              {job.estimated_duration && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Duration</h3>
                  <p>Estimated: {job.estimated_duration} hours</p>
                  {job.actual_duration && (
                    <p>Actual: {job.actual_duration} hours</p>
                  )}
                </div>
              )}

              {/* Tasks */}
              {job.tasks && job.tasks.length > 0 && (
                <div className=" rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Tasks</h3>
                  <div className="space-y-3">
                    {job.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600">
                            {task.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {job.safety_notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Safety Notes</h3>
                  <p className="text-gray-700">{job.safety_notes}</p>
                </div>
              )}
              {job.completion_notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Completion Notes
                  </h3>
                  <p className="text-gray-700">{job.completion_notes}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-gray-500">Job not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
