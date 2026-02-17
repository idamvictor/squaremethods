"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";
import { useEquipmentStore } from "@/store/equipment-store";
import { useEquipmentTypes } from "@/services/equipment-types/equipment-types-queries";
import {
  useUpdateEquipment,
  useEquipmentDetails,
} from "@/services/equipment/equipment-queries";
import { EquipmentType } from "@/services/equipment-types/equipment-types-types";
import { toast } from "sonner";

export function EditEquipmentModal() {
  const [formData, setFormData] = useState<{
    name: string;
    equipment_type_id: string;
    reference_code: string;
    date: string;
    notes: string;
    status: string;
    image: string;
    documents: string[];
  }>({
    name: "",
    equipment_type_id: "",
    reference_code: "",
    date: "",
    notes: "",
    status: "draft",
    image: "",
    documents: [],
  });
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [documentFileManagerOpen, setDocumentFileManagerOpen] = useState(false);

  const { editingEquipment, setEditingEquipment, setIsEditingEquipment } =
    useEquipmentStore();

  const updateEquipmentMutation = useUpdateEquipment();
  const { data: equipmentData } = useEquipmentDetails(editingEquipment?.id);

  // Load equipment data when modal opens
  useEffect(() => {
    if (editingEquipment && equipmentData?.data) {
      const equipment = equipmentData.data;
      setFormData({
        name: equipment.name,
        equipment_type_id: equipment.equipment_type_id,
        reference_code: equipment.reference_code,
        date: equipment.created_at?.split("T")[0] || "",
        notes: equipment.notes || "",
        status: equipment.status,
        image: equipment.image || "",
        documents: [],
      });
    }
  }, [editingEquipment, equipmentData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    if (!editingEquipment) {
      toast.error("No equipment selected");
      return;
    }

    if (
      !formData.name ||
      !formData.equipment_type_id ||
      !formData.reference_code
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await updateEquipmentMutation.mutateAsync({
        id: editingEquipment.id,
        data: {
          name: formData.name,
          notes: formData.notes,
          status: formData.status,
          documents: formData.documents,
        },
      });

      // Refresh the hierarchy data
      const store = useEquipmentStore.getState();
      await store.fetchHierarchy();

      handleCancel();
      toast.success("Equipment updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update equipment");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      equipment_type_id: "",
      reference_code: "",
      date: "",
      notes: "",
      status: "draft",
      image: "",
      documents: [],
    });
    setIsEditingEquipment(false);
    setEditingEquipment(null);
  };

  const { data: equipmentTypesData } = useEquipmentTypes();
  const equipmentTypes =
    equipmentTypesData?.data?.map((type: EquipmentType) => ({
      value: type.id,
      label: type.name,
      icon: type.icon || null,
    })) || [];

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold mb-6">Edit Equipment</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6 w-full">
          {/* Left Column - Image Upload and Form Fields */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Image Upload */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 w-full cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setFileManagerOpen(true)}
            >
              {formData.image ? (
                <div className="relative">
                  <Image
                    src={formData.image}
                    alt="Equipment"
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                    unoptimized
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFileManagerOpen(true);
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="w-full h-48 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Image
                      src="/placeholder.svg"
                      alt="Upload"
                      className="mx-auto mb-4"
                      width={48}
                      height={48}
                    />
                    <p className="text-sm text-gray-500">
                      Click to select equipment image from file manager
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div>
              <Label htmlFor="documents">Documents</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setDocumentFileManagerOpen(true)}
                >
                  Add Documents
                </Button>
                {formData.documents.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {formData.documents.map((docUrl: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                      >
                        <span className="truncate">
                          {docUrl.split("/").pop()}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              documents: prev.documents.filter(
                                (_, i) => i !== index,
                              ),
                            }));
                          }}
                          className="text-red-600 hover:text-red-700 ml-2"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipment-type">Equipment type</Label>
                  <Select
                    value={formData.equipment_type_id}
                    onValueChange={(value) =>
                      handleInputChange("equipment_type_id", value)
                    }
                    disabled
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select equipment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-blue-600">
                              {type.icon || "⚙️"}
                            </span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="equipment-name">
                    Equipment name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="equipment-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Cooling Pump #5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference-code">
                    Reference code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reference-code"
                    value={formData.reference_code}
                    onChange={(e) =>
                      handleInputChange("reference_code", e.target.value)
                    }
                    placeholder="54635bd"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Please Enter"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={updateEquipmentMutation.isPending}
          >
            {updateEquipmentMutation.isPending
              ? "Updating..."
              : "Update Equipment"}
          </Button>
        </div>
      </div>

      <FileManagerModal
        open={fileManagerOpen}
        onOpenChange={setFileManagerOpen}
        onFileSelect={(fileUrl) => {
          setFormData((prev) => ({ ...prev, image: fileUrl }));
          setFileManagerOpen(false);
        }}
      />

      <FileManagerModal
        open={documentFileManagerOpen}
        onOpenChange={setDocumentFileManagerOpen}
        onFileSelect={(fileUrl) => {
          setFormData((prev) => ({
            ...prev,
            documents: [...prev.documents, fileUrl],
          }));
          setDocumentFileManagerOpen(false);
        }}
      />
    </>
  );
}
