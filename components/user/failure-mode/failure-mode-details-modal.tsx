"use client";

import { format } from "date-fns";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFailureModeDetails } from "@/services/failure-mode/failure-mode-queries";

interface FailureModeDetailsModalProps {
  failureModeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FailureModeDetailsModal({
  failureModeId,
  open,
  onOpenChange,
}: FailureModeDetailsModalProps) {
  const { data: response, isLoading } = useFailureModeDetails(failureModeId);
  const failureMode = response?.data;

  const getStatusColor = (
    status: "open" | "resolved" | "in_progress" | undefined
  ) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "open":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "in_progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityColor = (
    priority: "low" | "medium" | "high" | undefined
  ) => {
    switch (priority) {
      case "high":
        return "border-red-500 text-red-500";
      case "medium":
        return "border-yellow-500 text-yellow-500";
      case "low":
        return "border-blue-500 text-blue-500";
      default:
        return "border-gray-500 text-gray-500";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Failure Mode Details</DialogTitle>
          {!isLoading && failureMode && (
            <DialogDescription>
              Details for failure mode: {failureMode.title}
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : failureMode ? (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6">
              {/* Image Section with Overlay */}
              {failureMode.image && (
                <div className="relative h-64 w-full">
                  <Image
                    src={failureMode.image}
                    alt={`Failure mode ${failureMode.title || ""}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  {/* Overlay with title and badges */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-lg bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div></div>
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-white">
                        {failureMode.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(failureMode.status)}
                        >
                          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
                          {failureMode.status
                            ? failureMode.status.charAt(0).toUpperCase() +
                              failureMode.status.slice(1)
                            : "Unknown"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(failureMode.priority)}
                        >
                          {failureMode.priority
                            ? failureMode.priority.charAt(0).toUpperCase() +
                              failureMode.priority.slice(1)
                            : "Low"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Equipment Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground">Equipment</h4>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    {failureMode.equipment?.icon && (
                      <div className="relative h-12 w-12">
                        <Image
                          src={failureMode.equipment.icon}
                          alt={failureMode.equipment?.name || "Equipment"}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {failureMode.equipment?.name || "Unknown Equipment"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Reference:{" "}
                        {failureMode.equipment?.reference_code || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporter Section */}
              <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground">
                  Reported By
                </h4>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={failureMode.reporter?.avatar_url}
                      alt={`${failureMode.reporter?.first_name || ""} ${
                        failureMode.reporter?.last_name || ""
                      }`}
                    />
                    <AvatarFallback>
                      {failureMode.reporter?.first_name?.[0] || ""}
                      {failureMode.reporter?.last_name?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {failureMode.reporter?.first_name || "Anonymous"}{" "}
                      {failureMode.reporter?.last_name || ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {failureMode.reporter?.role || "Unknown Role"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates and Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-medium text-muted-foreground">
                    Due Date
                  </h4>
                  <p>
                    {failureMode.due_date
                      ? format(new Date(failureMode.due_date), "MMMM dd, yyyy")
                      : "No due date"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-muted-foreground">Status</h4>
                  <p className="capitalize">{failureMode.status}</p>
                </div>
              </div>

              {/* Resolutions Section */}
              {failureMode.resolutions?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">
                    Resolutions
                  </h4>
                  <ul className="list-inside list-disc space-y-1">
                    {failureMode.resolutions.map((resolution, index) => (
                      <li key={index} className="text-sm">
                        {resolution || "No details provided"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Failed to load failure mode details
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
