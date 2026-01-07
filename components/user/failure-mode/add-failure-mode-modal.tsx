"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfile } from "@/services/users/users-querries";
import { useCreateFailureMode } from "@/services/failure-mode/failure-mode-queries";
import { CreateFailureModeInput } from "@/services/failure-mode/failure-mode-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Plus, Trash2, X, Calendar } from "lucide-react";
import { EquipmentHierarchyModal } from "@/components/user/jobs/equipment-hierarchy-modal";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Resolution {
  id: string;
  text: string;
}

export interface FailureModeData {
  title: string;
  resolutions: Resolution[];
  equipment: string;
  reportedBy: string;
  dueDate: string;
  image: string | null;
}

interface AddFailureModeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FailureModeData) => void;
}

export function AddFailureModeModal({
  open,
  onOpenChange,
  onSubmit,
}: AddFailureModeModalProps) {
  const [title, setTitle] = useState("");
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [newResolution, setNewResolution] = useState("");
  const [equipment, setEquipment] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEquipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const { data: profileData } = useProfile();
  const createFailureModeMutation = useCreateFailureMode();

  const reportedBy = profileData?.data
    ? `${profileData.data.first_name} ${profileData.data.last_name}`
    : "";

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleAddResolution = () => {
    if (newResolution.trim()) {
      setResolutions([
        ...resolutions,
        { id: String(Date.now()), text: newResolution.trim() },
      ]);
      setNewResolution("");
    }
  };

  const handleRemoveResolution = (id: string) => {
    setResolutions(resolutions.filter((res) => res.id !== id));
  };

  const handleSubmit = async () => {
    if (!profileData?.data?.id) {
      console.error("User profile not loaded");
      return;
    }

    if (!title || !equipment) {
      console.error("Required fields missing");
      return;
    }

    // Convert date string to ISO format with time
    const formattedDueDate = dueDate
      ? new Date(dueDate).toISOString()
      : undefined;

    const formattedImage = imagePreview || undefined;

    const failureModeInput: CreateFailureModeInput = {
      title,
      equipment_id: equipment,
      reported_by: profileData.data.id,
      status: "open",
      resolutions: resolutions.map((r) => r.text),
      due_date: formattedDueDate,
      image: formattedImage,
    };

    try {
      await createFailureModeMutation.mutateAsync(failureModeInput);

      // Reset form
      setTitle("");
      setResolutions([]);
      setNewResolution("");
      setEquipment("");
      setEquipmentName("");
      setDueDate("");
      setImagePreview(null);
      onOpenChange(false);

      // Notify parent component
      onSubmit({
        title,
        resolutions,
        equipment,
        reportedBy,
        dueDate,
        image: imagePreview,
      });
    } catch (error) {
      const err = error as { response?: { data?: unknown; status?: number } };
      console.error("Failed to create failure mode:", {
        error,
        data: err.response?.data,
        status: err.response?.status,
        requestData: failureModeInput,
      });
      // You might want to show an error toast here
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded border border-border">
                <div className="h-3 w-3 rounded-sm bg-muted" />
              </div>
              <DialogTitle className="text-base font-medium">
                Add New Failure Mode
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Image</Label>
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={480}
                      height={192}
                      className="h-48 w-full rounded-lg border border-border object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={handleRemoveImage}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsFileManagerOpen(true)}
                  >
                    Select Image
                  </Button>
                )}
              </div>

              {/* Failure Mode Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Failure Mode Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter failure mode title"
                />
              </div>

              {/* Resolutions */}
              <div className="space-y-2">
                <Label>Resolutions</Label>
                <div className="flex gap-2">
                  <Input
                    value={newResolution}
                    onChange={(e) => setNewResolution(e.target.value)}
                    placeholder="Click to add resolution"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddResolution();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleAddResolution}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {resolutions.length > 0 && (
                  <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-3">
                    {resolutions.map((resolution) => (
                      <div
                        key={resolution.id}
                        className="flex items-center justify-between rounded bg-background px-3 py-2"
                      >
                        <span className="text-sm">{resolution.text}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveResolution(resolution.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attached Equipment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    Attached Equipment
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEquipmentModalOpen(true)}
                  >
                    Select Equipment
                  </Button>
                </div>
                <div className="w-full p-3 bg-gray-50 rounded-md border">
                  {equipment ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">
                        {equipmentName}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEquipment("");
                          setEquipmentName("");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">
                      No equipment selected
                    </span>
                  )}
                </div>
              </div>

              {/* Team */}
              {/* Reported By */}
              <div className="space-y-2">
                <Label>Reported By</Label>
                <div className="w-full p-3 bg-gray-50 rounded-md border">
                  <span className="text-sm text-gray-700">
                    {reportedBy || "Loading..."}
                  </span>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dueDate ? (
                        format(new Date(dueDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dueDate ? new Date(dueDate) : undefined}
                      onSelect={(date) =>
                        setDueDate(date ? date.toISOString() : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="border-t border-border px-6 py-4">
            <Button
              onClick={handleSubmit}
              disabled={
                !title || !equipment || createFailureModeMutation.isPending
              }
              className="w-full bg-[#1e293b] hover:bg-[#334155]"
            >
              {createFailureModeMutation.isPending
                ? "Creating..."
                : "Create Failure Mode"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <EquipmentHierarchyModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        onAttach={(equipmentId, equipmentName) => {
          setEquipment(equipmentId);
          setEquipmentName(equipmentName);
        }}
      />

      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onFileSelect={(fileUrl) => {
          setImagePreview(fileUrl);
          setIsFileManagerOpen(false);
        }}
      />
    </>
  );
}
