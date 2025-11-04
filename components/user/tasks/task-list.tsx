"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useTasks, useDeleteTask } from "@/services/tasks/tasks-queries";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";
import { EditTaskDialog } from "./edit-task-dialog";
import { DeleteTaskDialog } from "./delete-task-dialog";

export function TaskList({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) {
  const { data: taskData, isLoading } = useTasks({ page, limit, search });
  const deleteTaskMutation = useDeleteTask();
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleDeleteTask = async (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTaskMutation.mutateAsync(taskToDelete);
      toast.success("Task deleted successfully");
      setTaskToDelete(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ?? "Failed to delete task";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Delete task error:", error);
      }
    }
  };

  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleEditTask = (task: { id: string; title: string }) => {
    setEditingTask(task);
  };

  const handleCloseEditDialog = () => {
    setEditingTask(null);
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading tasks...</div>;
  }

  const tasks = taskData?.data || [];

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm mb-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium text-gray-900">Task Title</h3>
          <h3 className="font-medium text-gray-900">Actions</h3>
        </div>

        {/* Task Items */}
        <div className="divide-y">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex-1">
                <p className="text-gray-900">{task.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEditTask(task)}
                >
                  <Pencil className="h-4 w-4 text-gray-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No tasks found matching your criteria.
          </div>
        )}
      </div>

      <EditTaskDialog
        task={editingTask}
        isOpen={!!editingTask}
        onClose={handleCloseEditDialog}
      />
      <DeleteTaskDialog
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
