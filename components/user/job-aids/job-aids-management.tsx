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
import { JobAidGrid } from "./job-aid-grid";
import { DeleteJobAidModal } from "./delete-job-aid-modal";
import { EditJobAidModal } from "./edit-job-aid-modal";
import { Grid3X3, List, Search } from "lucide-react";
import { useState } from "react";
import {
  useDeleteJobAid,
  useUpdateJobAid,
  useJobAidDetails,
} from "@/services/job-aid/job-aid-queries";
import { JobAidStatus } from "@/services/job-aid/job-aid-types";
import { toast } from "sonner";

interface JobAidsManagementProps {
  onCreateClick: () => void;
}

export function JobAidsManagement({ onCreateClick }: JobAidsManagementProps) {
  // const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<JobAidStatus | undefined>();
  const [equipmentId, setEquipmentId] = useState<string>();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const deleteJobAidMutation = useDeleteJobAid();
  const updateJobAidMutation = useUpdateJobAid(editId || "");
  const { data: editingJobAid } = useJobAidDetails(editId || "");

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleEdit = (id: string) => {
    setEditId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteJobAidMutation.mutateAsync(deleteId);
      toast.success("Job aid deleted successfully");
    } catch (error) {
      toast.error(
        "Failed to delete job aid: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setDeleteId(null);
    }
  };

  const handleUpdate = async (data: {
    title: string;
    description: string;
    status: JobAidStatus;
    safety_notes: string;
  }) => {
    if (!editId) return;

    try {
      await updateJobAidMutation.mutateAsync(data);
      toast.success("Job aid updated successfully");
      setEditId(null);
    } catch (error) {
      toast.error(
        "Failed to update job aid: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Job Aids</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button onClick={onCreateClick}>Create</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          <Select
            value={status}
            onValueChange={(value: JobAidStatus) => setStatus(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>

          <Select value={equipmentId} onValueChange={setEquipmentId}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              {/* Add your equipment options here */}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          className="text-gray-500 hover:text-gray-700"
          onClick={() => {
            setSearchQuery("");
            setStatus(undefined);
            setEquipmentId(undefined);
          }}
        >
          Reset Filter
        </Button>
      </div>

      {/* Job Aid Grid */}
      <JobAidGrid
        viewMode={viewMode}
        searchQuery={searchQuery}
        status={status}
        equipmentId={equipmentId}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteJobAidModal
        open={!!deleteId}
        isDeleting={deleteJobAidMutation.isPending}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Edit Job Aid Modal */}
      <EditJobAidModal
        jobAid={editingJobAid?.data}
        open={!!editId}
        isLoading={updateJobAidMutation.isPending}
        onClose={() => setEditId(null)}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
