"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import { useTaskStore } from "@/store/task-store";

export function TaskList() {
  const { getPaginatedTasks, deleteTask } = useTaskStore();
  const tasks = getPaginatedTasks();

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleEditTask = (taskId: string) => {
    // Placeholder for edit functionality
    console.log("Edit task:", taskId);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm mb-6">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium text-gray-900">Task description</h3>
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
              <p className="text-gray-900">{task.description}</p>
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
                onClick={() => handleEditTask(task.id)}
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
  );
}
