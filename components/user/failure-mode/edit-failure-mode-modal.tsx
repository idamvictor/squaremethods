"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import Image from "next/image";
import { Trash2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FailureMode,
  UpdateFailureModeInput,
} from "@/services/failure-mode/failure-mode-types";
import { useUpdateFailureMode } from "@/services/failure-mode/failure-mode-queries";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";
import { EquipmentHierarchyModal } from "@/components/user/jobs/equipment-hierarchy-modal";

interface Equipment {
  id: string;
  name: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["open", "resolved", "in_progress"] as const),
  due_date: z.string(),
  image: z.string().nullable().optional(),
  resolutions: z.array(z.string()).optional(),
  equipment_ids: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Resolution {
  id: string;
  text: string;
}

interface EditFailureModeModalProps {
  failureMode: FailureMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFailureModeModal({
  failureMode,
  open,
  onOpenChange,
}: EditFailureModeModalProps) {
  const queryClient = useQueryClient();
  const { mutate: updateFailureMode, isPending } = useUpdateFailureMode(
    failureMode.id,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    failureMode.image || null,
  );
  const [resolutions, setResolutions] = useState<Resolution[]>(
    (failureMode.resolutions || []).map((r, idx) => ({
      id: String(idx),
      text: r,
    })),
  );
  const [newResolution, setNewResolution] = useState("");
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(
    failureMode.equipment_id && failureMode.equipment
      ? [{ id: failureMode.equipment_id, name: failureMode.equipment.name }]
      : [],
  );
  const [isEquipmentModalOpen, setEquipmentModalOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: failureMode.title || "",
      status: failureMode.status,
      due_date: failureMode.due_date
        ? format(new Date(failureMode.due_date), "yyyy-MM-dd")
        : "",
      image: failureMode.image || null,
      resolutions: failureMode.resolutions || [],
      equipment_ids: failureMode.equipment_id ? [failureMode.equipment_id] : [],
    },
  });

  // Update form when failureMode changes
  useEffect(() => {
    form.reset({
      title: failureMode.title || "",
      status: failureMode.status,
      due_date: failureMode.due_date
        ? format(new Date(failureMode.due_date), "yyyy-MM-dd")
        : "",
      image: failureMode.image || null,
      resolutions: failureMode.resolutions || [],
      equipment_ids: failureMode.equipment_id ? [failureMode.equipment_id] : [],
    });
    setImagePreview(failureMode.image || null);
    setResolutions(
      (failureMode.resolutions || []).map((r, idx) => ({
        id: String(idx),
        text: r,
      })),
    );
    setEquipmentList(
      failureMode.equipment_id && failureMode.equipment
        ? [{ id: failureMode.equipment_id, name: failureMode.equipment.name }]
        : [],
    );
  }, [
    failureMode.id,
    failureMode.title,
    failureMode.status,
    failureMode.due_date,
    failureMode.image,
    failureMode.resolutions,
    failureMode.equipment_id,
    failureMode.equipment,
    form,
  ]);

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue("image", null);
  };

  const handleAddResolution = () => {
    if (newResolution.trim()) {
      const newRes = {
        id: String(Date.now()),
        text: newResolution.trim(),
      };
      setResolutions([...resolutions, newRes]);
      setNewResolution("");
    }
  };

  const handleRemoveResolution = (id: string) => {
    setResolutions(resolutions.filter((res) => res.id !== id));
  };

  const handleAddEquipment = (equipmentId: string, equipmentName: string) => {
    const equipmentExists = equipmentList.some((e) => e.id === equipmentId);
    if (!equipmentExists) {
      const newEquipmentList = [
        ...equipmentList,
        { id: equipmentId, name: equipmentName },
      ];
      setEquipmentList(newEquipmentList);
      form.setValue(
        "equipment_ids",
        newEquipmentList.map((e) => e.id),
      );
    }
  };

  const handleRemoveEquipment = (equipmentId: string) => {
    const newEquipmentList = equipmentList.filter((e) => e.id !== equipmentId);
    setEquipmentList(newEquipmentList);
    form.setValue(
      "equipment_ids",
      newEquipmentList.map((e) => e.id),
    );
  };

  const onSubmit = (data: FormData) => {
    const updateData: UpdateFailureModeInput = {
      title: data.title,
      status: data.status,
      due_date: data.due_date || undefined,
      image: imagePreview || undefined,
      resolutions: resolutions.map((r) => r.text),
      equipment_id: equipmentList[0]?.id || undefined,
    };

    updateFailureMode(updateData, {
      onSuccess: () => {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["failureModes"] });
        queryClient.invalidateQueries({
          queryKey: ["failureMode", failureMode.id],
        });

        onOpenChange(false);
        form.reset();
        setImagePreview(null);
        setResolutions([]);
        setNewResolution("");
        setEquipmentList([]);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col p-0 gap-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col max-h-[90vh] gap-0"
          >
            <DialogHeader className="flex-shrink-0 border-b px-6 py-4">
              <DialogTitle>Edit Failure Mode</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
              <div className="space-y-4">
                {/* Image */}
                <div className="space-y-2">
                  <FormLabel>Image</FormLabel>
                  {imagePreview ? (
                    <div className="relative">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        width={400}
                        height={160}
                        className="h-40 w-full rounded-lg border border-border object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8"
                        onClick={handleRemoveImage}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsFileManagerOpen(true)}
                      type="button"
                    >
                      Select Image
                    </Button>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter failure mode title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Equipment */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium">
                      Equipment
                    </FormLabel>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEquipmentModalOpen(true)}
                      type="button"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Equipment
                    </Button>
                  </div>
                  {equipmentList.length > 0 ? (
                    <div className="space-y-2 rounded-lg border border-border bg-muted/50 p-3">
                      {equipmentList.map((equip) => (
                        <div
                          key={equip.id}
                          className="flex items-center justify-between rounded bg-background px-3 py-2"
                        >
                          <span className="text-sm text-gray-700">
                            {equip.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveEquipment(equip.id)}
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full p-3 bg-gray-50 rounded-md border">
                      <span className="text-sm text-gray-500">
                        No equipment selected
                      </span>
                    </div>
                  )}
                </div>

                {/* Resolutions */}
                <div className="space-y-2">
                  <FormLabel>Resolutions</FormLabel>
                  <div className="flex gap-2">
                    <Textarea
                      value={newResolution}
                      onChange={(e) => setNewResolution(e.target.value)}
                      placeholder="Enter resolution"
                      className="min-h-20 resize-none"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={handleAddResolution}
                      className="self-start mt-1"
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
                            onClick={() =>
                              handleRemoveResolution(resolution.id)
                            }
                            type="button"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-shrink-0 border-t px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onFileSelect={(fileUrl) => {
          setImagePreview(fileUrl);
          form.setValue("image", fileUrl);
          setIsFileManagerOpen(false);
        }}
      />

      <EquipmentHierarchyModal
        isOpen={isEquipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        onAttach={(equipmentId, equipmentName) => {
          handleAddEquipment(equipmentId, equipmentName);
          setEquipmentModalOpen(false);
        }}
      />
    </Dialog>
  );
}
