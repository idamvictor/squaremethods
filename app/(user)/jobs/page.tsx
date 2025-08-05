"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/store/task-store";
import { SearchInput } from "@/components/jobs/search-input";
import { TaskFilters } from "@/components/jobs/task-filters";
import { TaskTable } from "@/components/jobs/task-table";
import { AddTaskModal } from "@/components/jobs/add-task-modal";

export default function TaskManagementPage() {
  const { openAddModal } = useTaskStore();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Task Management</CardTitle>
            <Button onClick={openAddModal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput />
            </div>
            <TaskFilters />
          </div>
          <TaskTable />
        </CardContent>
      </Card>
      <AddTaskModal />
    </div>
  );
}
