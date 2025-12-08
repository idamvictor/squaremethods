"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Edit2, Plus, Upload, X, Loader2 } from "lucide-react";
import { EquipmentHierarchyModal } from "../jobs/equipment-hierarchy-modal";
import { useCreateJobAid } from "@/services/job-aid/job-aid-queries";
import { toast } from "sonner";

interface AddJobAidFormProps {
  onNewInstructionClick: () => void;
  onNewStepClick: () => void;
}

export default function AddJobAidForm({
  onNewInstructionClick,
  onNewStepClick,
}: AddJobAidFormProps) {
  const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
  });

  const createJobAidMutation = useCreateJobAid();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a job aid title");
      return false;
    }
    if (!formData.category.trim()) {
      toast.error("Please select a category");
      return false;
    }
    if (!selectedEquipment) {
      toast.error("Please assign equipment to this job aid");
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    try {
      await createJobAidMutation.mutateAsync({
        equipment_id: selectedEquipment!.id,
        title: formData.title,
        description: formData.category,
        status: "published",
        safety_notes: "",
      });
      toast.success("Job aid published successfully!");
      // Reset form
      setFormData({ title: "", category: "" });
      setSelectedEquipment(null);
    } catch (error) {
      toast.error("Failed to publish job aid. Please try again.");
      console.error("Publish error:", error);
    }
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    try {
      await createJobAidMutation.mutateAsync({
        equipment_id: selectedEquipment!.id,
        title: formData.title,
        description: formData.category,
        status: "draft",
        safety_notes: "",
      });
      toast.success("Job aid saved as draft!");
      // Reset form
      setFormData({ title: "", category: "" });
      setSelectedEquipment(null);
    } catch (error) {
      toast.error("Failed to save job aid as draft. Please try again.");
      console.error("Draft save error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="w-full  p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create new job aid
            </h1>
            <p className="text-muted-foreground">
              Step-by-step visual instructions for frontline tasks
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Import
          </Button>
        </div>

        {/* Form sections */}
        <div className="space-y-6">
          {/* Job Aid Details */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Job Aid Details
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              {/* Title and Category - Two column layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title field */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Title <span className="text-destructive">*</span>
                  </label>
                  <Input
                    placeholder="Enter job aid title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select category</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="safety">Safety</option>
                    <option value="operations">Operations</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Assign to Equipment */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  Assign to Equipment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select the machine or system this Job Aid applies to
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/10"
                onClick={() => setIsEquipmentModalOpen(true)}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {selectedEquipment ? (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{selectedEquipment.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ID: {selectedEquipment.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => setSelectedEquipment(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <p className="text-muted-foreground text-sm">
                  No equipment assigned yet. Click the + button to add
                  equipment.
                </p>
              </div>
            )}
          </Card>

          {/* Safety Precautions */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    Safety Precautions
                  </h3>
                  <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Add critical safety steps or warnings or{" "}
                  <button className="text-primary hover:underline">
                    upload an existing safety guide
                  </button>
                  .
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>

            {/* Add buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="border-2 border-dashed border-border rounded-lg p-6 hover:bg-muted/50 transition-colors flex flex-col items-center gap-2">
                <Plus className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  New Instruction
                </span>
              </button>
              <button className="border-2 border-dashed border-border rounded-lg p-6 hover:bg-muted/50 transition-colors flex flex-col items-center gap-2">
                <Plus className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  New Steps
                </span>
              </button>
            </div>
          </Card>

          {/* Job aid Procedures */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Job aid Procedures
                </h3>
                <p className="text-sm text-gray-500">
                  Build visual step-by-step instructions. Add a new step or{" "}
                  <button className="text-blue-600 hover:underline">
                    import pdf
                  </button>
                  .
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-500 hover:text-gray-700"
              >
                <Upload className="w-4 h-4" />
                Upload
              </Button>
            </div>

            {/* Add buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onNewInstructionClick}
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                  New Instruction
                </span>
              </button>
              <button
                onClick={onNewStepClick}
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors flex flex-col items-center gap-2"
              >
                <Plus className="w-6 h-6 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                  New Steps
                </span>
              </button>
            </div>
          </Card>

          {/* Action buttons - Fixed at bottom right */}
          <div className="fixed bottom-6 right-6 flex gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={createJobAidMutation.isPending}
            >
              {createJobAidMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save as draft"
              )}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={createJobAidMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createJobAidMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish"
              )}
            </Button>
          </div>
        </div>
      </div>

      <EquipmentHierarchyModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setIsEquipmentModalOpen(false)}
        onAttach={(id, name) => {
          setSelectedEquipment({ id, name });
        }}
      />
    </main>
  );
}
