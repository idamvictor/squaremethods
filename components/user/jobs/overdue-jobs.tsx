"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { useOverdueJobs } from "@/services/jobs/jobs-queries";
import { Job } from "@/services/jobs/jobs-types";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { avatarImage } from "@/constants/images";

export function OverdueJobs() {
  const { data: overdueJobs, isLoading } = useOverdueJobs({
    limit: 5, // Show only top 5 overdue jobs
  });

  if (isLoading) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle>Overdue Jobs</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-500">Loading overdue jobs...</div>
        </CardContent>
      </Card>
    );
  }

  if (!overdueJobs?.data || overdueJobs.data.length === 0) {
    return null;
  }

  const getPriorityBadge = (priority: Job["priority"]) => {
    const colors = {
      urgent: "bg-red-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
    };
    return (
      <Badge className={`${colors[priority]} text-white`}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - due.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle>Overdue Jobs</CardTitle>
          <Badge variant="destructive" className="ml-2">
            {overdueJobs.data.length} Overdue
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {overdueJobs.data.map((job: Job) => (
            <div
              key={job.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-red-100 hover:border-red-200 transition-colors"
            >
              <div className="space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg">{job.title}</h3>
                  {getPriorityBadge(job.priority)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Due Date:</span>
                    <span>{formatDate(job.due_date)}</span>
                    <Badge variant="destructive">
                      {getDaysOverdue(job.due_date)} days overdue
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Team:</span>
                    <span>{job.team.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Assigned to:</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={avatarImage.image1}
                          alt={`${job.assignedUser.first_name} ${job.assignedUser.last_name}`}
                        />
                      </Avatar>
                      <span>
                        {job.assignedUser.first_name} {job.assignedUser.last_name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Duration:</span>
                    <span>{job.estimated_duration} hours</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}