"use client";

import { TaskManagement } from "@/components/user/tasks/task-management";
import { useSearchParams } from "next/navigation";

export default function TasksPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId");

  return (
    <div className="min-h-screen bg-gray-50">
      <TaskManagement initialTaskId={taskId} />
    </div>
  );
}
