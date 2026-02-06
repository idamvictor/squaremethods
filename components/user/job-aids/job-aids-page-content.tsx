"use client";

import { JobAidsManagement } from "@/components/user/job-aids/job-aids-management";
import AddJobAidForm from "@/components/user/job-aids/add-job-aid-form";
import { EditJobAidModal } from "@/components/user/job-aids/edit-job-aid-modal";
import ImageAnnotationManager from "@/components/user/job-aids/image-annotation/image-annotation-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import {
  useJobAidDetails,
  useUpdateJobAid,
} from "@/services/job-aid/job-aid-queries";
import { JobAidStatus } from "@/services/job-aid/job-aid-types";
import { toast } from "sonner";
import { useJobAidStore } from "@/store/job-aid-store";

export default function JobAidsPageContent() {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAnnotating, setIsAnnotating] = useState(false);

  const { data: editingJobAid } = useJobAidDetails(editingId || "");
  const updateJobAidMutation = useUpdateJobAid(editingId || "");
  const setCurrentJobAid = useJobAidStore((state) => state.setCurrentJobAid);

  const handleEditClick = (id: string) => {
    setEditingId(id);
    setIsEditing(true);
  };

  const handleEditClose = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const handleUpdateJobAid = async (data: {
    title: string;
    category: string;
    instruction: string;
    image: string;
    estimated_duration: number;
    status: JobAidStatus;
    equipment_ids: string[];
  }) => {
    if (!editingId) return;

    try {
      await updateJobAidMutation.mutateAsync(data);
      toast.success("Job aid updated successfully");

      // Set the current job aid in store for annotation manager
      if (editingJobAid?.data) {
        setCurrentJobAid(editingJobAid.data);
      }

      // Navigate to annotation manager
      setIsEditing(false);
      setIsAnnotating(true);
    } catch (error) {
      toast.error(
        "Failed to update job aid: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    }
  };

  if (isEditing) {
    return (
      <div className="min-h-screen">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={handleEditClose}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Aids
          </Button>
          <div className="bg-white rounded-lg p-6">
            <EditJobAidModal
              jobAid={editingJobAid?.data}
              open={true}
              isLoading={updateJobAidMutation.isPending}
              onClose={handleEditClose}
              onSubmit={handleUpdateJobAid}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isAnnotating) {
    return (
      <div className="min-h-screen">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => {
              setIsAnnotating(false);
              setEditingId(null);
            }}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Aids
          </Button>
          <ImageAnnotationManager />
        </div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="min-h-screen">
        <div className="p-6">
          <Button
            variant="ghost"
            className=""
            onClick={() => setIsCreating(false)}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Job Aids
          </Button>
          <AddJobAidForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <JobAidsManagement
        onCreateClick={() => setIsCreating(true)}
        onEditClick={handleEditClick}
      />
    </div>
  );
}
