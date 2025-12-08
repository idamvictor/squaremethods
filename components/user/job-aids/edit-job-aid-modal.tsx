"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface EditJobAidModalProps {
  jobAid?: JobAid;
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    instruction: string;
    status: JobAidStatus;
  }) => void;
}

export function EditJobAidModal({
  jobAid,
  open,
  isLoading,
  onClose,
  onSubmit,
}: EditJobAidModalProps) {
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      title: "",
      instruction: "",
      status: "draft" as JobAidStatus,
    },
  });

  useEffect(() => {
    if (jobAid) {
      setValue("title", jobAid.title);
      setValue("instruction", jobAid.instruction || "");
      setValue("status", jobAid.status);
    }
  }, [jobAid, setValue]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <h2 className="text-lg font-semibold">Edit Job Aid</h2>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                {...register("title", { required: true })}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="instruction" className="text-sm font-medium">
                Instructions
              </label>
              <Textarea
                id="instruction"
                {...register("instruction", { required: true })}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
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
          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
