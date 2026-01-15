"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskList } from "./task-list";
import { TaskPagination } from "./task-pagination";
import { Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useTasks } from "@/services/tasks/tasks-queries";
import { NewTaskDialog } from "./new-task-dialog";
import { TaskDetailsModal } from "./task-details-modal";

interface TaskManagementProps {
  initialTaskId?: string | null;
}

export function TaskManagement({ initialTaskId }: TaskManagementProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

  useEffect(() => {
    if (initialTaskId) {
      setSelectedTaskId(initialTaskId);
      setIsTaskDetailsOpen(true);
    }
  }, [initialTaskId]);

  const { data: taskData } = useTasks({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button className="" onClick={() => setIsNewTaskDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <NewTaskDialog
            isOpen={isNewTaskDialogOpen}
            onClose={() => setIsNewTaskDialogOpen(false)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select
              value={String(itemsPerPage)}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <TaskList page={currentPage} limit={itemsPerPage} search={searchQuery} />

      {/* Pagination */}
      <TaskPagination
        currentPage={currentPage}
        totalPages={taskData?.pagination.pages || 1}
        onPageChange={handlePageChange}
      />

      <TaskDetailsModal
        taskId={selectedTaskId}
        open={isTaskDetailsOpen}
        onOpenChange={setIsTaskDetailsOpen}
      />
    </div>
  );
}
