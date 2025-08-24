"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
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
import { useEquipmentStore, type EquipmentType } from "@/store/equipment-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const getEquipmentColor = (type: string) => {
  const colors = {
    pump: "text-blue-600",
    assembly: "text-orange-600",
    conveyor: "text-green-600",
    motor: "text-purple-600",
    valve: "text-red-600",
    sensor: "text-yellow-600",
  };
  return colors[type as keyof typeof colors] || "text-gray-600";
};

export function AddEquipmentModal() {
  const [formData, setFormData] = useState({
    name: "",
    type: "" as EquipmentType,
    referenceCode: "",
    date: "",
    notes: "",
    image: "",
  });
  const [qrGenerated, setQrGenerated] = useState(false);

  const {
    setShowAddEquipmentModal,
    addEquipment,
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

  const handleRegister = () => {
    if (
      !formData.name ||
      !formData.type ||
      !formData.referenceCode ||
      !formData.date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (showFloatingButtons) {
      addEquipment(showFloatingButtons, formData);
      setQrGenerated(true);
      toast.success("QR Code generated successfully");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      type: "" as EquipmentType,
      referenceCode: "",
      date: "",
      notes: "",
      image: "",
    });
    setQrGenerated(false);
    setShowAddEquipmentModal(false);
  };

  const equipmentTypes = [
    { value: "assembly", label: "Assembly", icon: "⚙️" },
    { value: "pump", label: "Pump", icon: "🔧" },
    { value: "conveyor", label: "Conveyor", icon: "📦" },
    { value: "motor", label: "Motor", icon: "⚡" },
    { value: "valve", label: "Valve", icon: "🔩" },
    { value: "sensor", label: "Sensor", icon: "📡" },
  ];

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

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipment-type">Equipment type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange("type", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {formData.type ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-lg",
                                getEquipmentColor(formData.type)
                              )}
                            >
                              {
                                equipmentTypes.find(
                                  (t) => t.value === formData.type
                                )?.icon
                              }
                            </span>
                            <span>
                              {
                                equipmentTypes.find(
                                  (t) => t.value === formData.type
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
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-lg",
                                getEquipmentColor(type.value)
                              )}
                            >
                              {type.icon}
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
                    value={formData.referenceCode}
                    onChange={(e) =>
                      handleInputChange("referenceCode", e.target.value)
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
