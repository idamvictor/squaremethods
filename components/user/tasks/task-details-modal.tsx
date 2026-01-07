"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTaskById } from "@/services/tasks/tasks-queries";

interface TaskDetailsModalProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDetailsModal({
  taskId,
  open,
  onOpenChange,
}: TaskDetailsModalProps) {
  const { data: response, isLoading } = useTaskById(taskId || undefined);
  const task = response?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : task ? (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              {/* Title */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{task.title}</h3>
              </div>

              {/* Job Aids Section */}
              {task.jobAids && task.jobAids.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-muted-foreground">
                    Job Aids ({task.jobAids.length})
                  </h4>
                  <div className="space-y-3">
                    {task.jobAids.map((jobAid) => (
                      <div
                        key={jobAid.id}
                        className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h5 className="font-medium text-foreground">
                                {jobAid.title}
                              </h5>
                              <p className="text-sm text-muted-foreground mt-1">
                                {jobAid.instruction}
                              </p>
                            </div>
                            <Badge variant="secondary">{jobAid.status}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                            <span>
                              Duration: {jobAid.estimated_duration} mins
                            </span>
                            <span>Views: {jobAid.view_count}</span>
                            <span>Scans: {jobAid.scan_count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!task.jobAids ||
                (task.jobAids.length === 0 && (
                  <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                    No job aids associated with this task
                  </div>
                ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Failed to load task details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
