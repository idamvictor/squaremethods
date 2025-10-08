"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Download, Settings } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEquipmentStore } from "@/store/equipment-store";
import { useEquipmentTypes } from "@/services/equipment-types/equipment-types-queries";
import { useCreateEquipment } from "@/services/equipment/equipment-queries";
import { CreateEquipmentInput } from "@/services/equipment/equipment-types";
import { EquipmentType } from "@/services/equipment-types/equipment-types-types";
import { toast } from "sonner";

export function AddEquipmentModal() {
  const [formData, setFormData] = useState<
    Omit<CreateEquipmentInput, "equipment_type_id" | "location_id"> & {
      equipment_type_id: string;
      location_id: string;
      date: string;
      image: string;
      documents: File[];
    }
  >({
    name: "",
    equipment_type_id: "",
    location_id: "",
    reference_code: "",
    date: "",
    notes: "",
    status: "draft",
    image: "",
    documents: [],
  });
  const [qrGenerated, setQrGenerated] = useState(false);

  const {
    setShowAddEquipmentModal,
    showFloatingButtons,
    showAddEquipmentModal,
  } = useEquipmentStore();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files],
    }));
  };

  const createEquipmentMutation = useCreateEquipment();

  const handleRegister = async () => {
    if (
      !formData.name ||
      !formData.equipment_type_id ||
      !formData.reference_code ||
      !formData.date ||
      !showFloatingButtons
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createEquipmentMutation.mutateAsync({
        equipment_type_id: formData.equipment_type_id,
        location_id: showFloatingButtons,
        name: formData.name,
        reference_code: formData.reference_code,
        notes: formData.notes,
        status: formData.status,
      });

      // Refresh the hierarchy data
      const store = useEquipmentStore.getState();
      await store.fetchHierarchy();

      setQrGenerated(true);
      toast.success("Equipment created successfully");
      handleCancel();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create equipment");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      equipment_type_id: "",
      location_id: "",
      reference_code: "",
      date: "",
      notes: "",
      status: "draft",
      image: "",
      documents: [],
    });
    setQrGenerated(false);
    setShowAddEquipmentModal(false);
  };

  const { data: equipmentTypesData } = useEquipmentTypes();
  const equipmentTypes =
    equipmentTypesData?.data?.map((type: EquipmentType) => ({
      value: type.id,
      label: type.name,
      icon: type.icon || null,
    })) || [];

  return (
    <Dialog
      open={showAddEquipmentModal}
      onOpenChange={setShowAddEquipmentModal}
    >
      <DialogContent className="max-w-5xl sm:max-w-[60vw] w-full max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Equipment Registration</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 w-full">
          {/* Left Column - Image Upload and Form Fields */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 w-full">
              {formData.image ? (
                <Image
                  src={formData.image}
                  alt="Equipment"
                  width={400}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg"
                  unoptimized // Since we're using a data URL
                />
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
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <p className="text-sm text-gray-500">
                        Drop your equipment image here, or{" "}
                        <span className="text-blue-600 hover:text-blue-700">
                          click to upload
                        </span>
                      </p>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div>
              <Label htmlFor="documents">Documents</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <input
                  id="documents"
                  type="file"
                  multiple
                  onChange={handleDocumentsUpload}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {formData.documents.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {formData.documents.map((file: File, index: number) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-white p-2 rounded-md"
                      >
                        <span className="text-sm text-gray-600">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              documents: prev.documents.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                          className="text-red-500 hover:text-red-700"
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
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {formData.equipment_type_id ? (
                          <div className="flex items-center gap-2">
                            {(() => {
                              const equipmentType = equipmentTypes.find(
                                (t: { value: string; icon: string | null }) =>
                                  t.value === formData.equipment_type_id
                              );
                              return equipmentType?.icon ? (
                                <Image
                                  src={equipmentType.icon}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="w-5 h-5"
                                />
                              ) : (
                                <Settings className="w-5 h-5 text-gray-600" />
                              );
                            })()}
                            <span>
                              {
                                equipmentTypes.find(
                                  (t: { value: string; label: string }) =>
                                    t.value === formData.equipment_type_id
                                )?.label
                              }
                            </span>
                          </div>
                        ) : (
                          "Select type"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map(
                        (type: {
                          value: string;
                          label: string;
                          icon: string | null;
                        }) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.icon ? (
                                <Image
                                  src={type.icon}
                                  alt=""
                                  width={20}
                                  height={20}
                                  className="w-5 h-5"
                                />
                              ) : (
                                <Settings className="w-5 h-5 text-gray-600" />
                              )}
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        )
                      )}
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

              {qrGenerated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm">
                    QR Code generated successfully
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="w-32 h-32 mx-auto mb-4">
                {qrGenerated ? (
                  <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-white rounded-sm" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">QR Code</p>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-800 text-white hover:bg-blue-700"
                disabled={!qrGenerated}
              >
                <Download className="h-4 w-4 mr-2" />
                Download QR (PNG)
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleRegister}>Register</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
