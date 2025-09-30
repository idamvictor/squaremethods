"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";

interface PersonalInformationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
}

interface PersonalInformationFormProps {
  data: PersonalInformationData;
  onEdit?: () => void;
  onChange?: (data: PersonalInformationData) => void;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

export function PersonalInformationForm({
  data,
  onEdit,
  onChange,
  onSave,
  isSaving = false,
}: PersonalInformationFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState(data);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Check if current data is different from initial data
    const hasAnyChanges = Object.keys(data).some(
      (key) =>
        data[key as keyof PersonalInformationData] !==
        initialData[key as keyof PersonalInformationData]
    );
    setHasChanges(hasAnyChanges);
  }, [data, initialData]);

  const handleEditClick = () => {
    if (!isEditing) {
      setInitialData(data);
      setIsEditing(true);
      onEdit?.();
    }
  };

  const handleSaveClick = async () => {
    if (onSave) {
      await onSave();
      setIsEditing(false);
      setInitialData(data);
    }
  };

  const handleInputChange = (
    field: keyof PersonalInformationData,
    value: string
  ) => {
    if (onChange && isEditing) {
      onChange({ ...data, [field]: value });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Personal Information
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Editing..." : "Edit"}
          </Button>
          {isEditing && onSave && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveClick}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700"
          >
            First Name
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="w-full"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-700"
          >
            Last Name
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="w-full"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="w-full"
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="department"
            className="text-sm font-medium text-gray-700"
          >
            Department
          </Label>
          <Input
            id="department"
            value={data.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            className="w-full max-w-md"
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
}
