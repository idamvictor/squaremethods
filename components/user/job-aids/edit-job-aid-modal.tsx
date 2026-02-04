"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { JobAid, JobAidStatus } from "@/services/job-aid/job-aid-types";
import { useForm } from "react-hook-form";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";
import { Image as ImageIcon, X } from "lucide-react";
import NextImage from "next/image";
import { toast } from "sonner";

interface EditJobAidModalProps {
  jobAid?: JobAid;
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    category: string;
    instruction: string;
    image: string;
    estimated_duration: number;
    status: JobAidStatus;
  }) => void;
}

export function EditJobAidModal({
  jobAid,
  isLoading,
  onClose,
  onSubmit,
}: EditJobAidModalProps) {
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      category: "",
      instruction: "",
      image: "",
      estimated_duration: 0,
      status: "draft" as JobAidStatus,
    },
  });

  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const imageValue = watch("image");

  useEffect(() => {
    if (jobAid) {
      setValue("title", jobAid.title);
      setValue("category", jobAid.category || "");
      setValue("instruction", jobAid.instruction || "");
      setValue("image", jobAid.image || "");
      setValue("estimated_duration", jobAid.estimated_duration || 0);
      setValue("status", jobAid.status);
    }
  }, [jobAid, setValue]);

  const handleFileSelect = (fileUrl: string) => {
    setValue("image", fileUrl);
    setIsFileManagerOpen(false);
    toast.success("Image updated successfully!");
  };

  const handleRemoveImage = () => {
    setValue("image", "");
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Edit Job Aid</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mb-6">
            {/* Title */}
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                {...register("title", { required: true })}
                disabled={isLoading}
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                {...register("category", { required: true })}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select category</option>
                <option value="maintenance">Maintenance</option>
                <option value="safety">Safety</option>
                <option value="operations">Operations</option>
              </select>
            </div>

            {/* Instructions */}
            <div className="grid gap-2">
              <label htmlFor="instruction" className="text-sm font-medium">
                Instructions <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="instruction"
                {...register("instruction", { required: true })}
                disabled={isLoading}
                className="min-h-32"
              />
            </div>

            {/* Image */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">
                Image <span className="text-destructive">*</span>
              </label>
              {imageValue ? (
                <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden">
                  <NextImage
                    src={imageValue}
                    alt="Job Aid Image"
                    fill
                    className="object-cover"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                    type="button"
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-32 border-dashed bg-transparent"
                  onClick={() => setIsFileManagerOpen(true)}
                  disabled={isLoading}
                >
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to select image
                    </span>
                  </div>
                </Button>
              )}
            </div>

            {/* Estimated Duration */}
            <div className="grid gap-2">
              <label
                htmlFor="estimated_duration"
                className="text-sm font-medium"
              >
                Estimated Duration (minutes)
              </label>
              <Input
                id="estimated_duration"
                type="number"
                {...register("estimated_duration")}
                disabled={isLoading}
                min="0"
                placeholder="e.g., 15"
              />
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-destructive">*</span>
              </label>
              <Select
                defaultValue={jobAid?.status}
                onValueChange={(value: JobAidStatus) =>
                  setValue("status", value)
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onFileSelect={handleFileSelect}
      />
    </>
  );
}
