"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle } from "lucide-react";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";

interface ProfileHeaderProps {
  name: string;
  role: string;
  location: string;
  avatarUrl?: string;
  isVerified?: boolean;
  onEdit?: () => void;
  onAvatarChange?: (newAvatarUrl: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
  hasChanges?: boolean;
}

export function ProfileHeader({
  name,
  role,
  location,
  avatarUrl,
  isVerified = false,
  onEdit,
  onAvatarChange,
  onSave,
  isSaving = false,
  hasChanges = false,
}: ProfileHeaderProps) {
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  const handleFileSelect = (fileUrl: string) => {
    if (onAvatarChange) {
      onAvatarChange(fileUrl);
    }
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-lg border">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-lg font-semibold">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {onAvatarChange && (
            <button
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity"
              onClick={() => setIsFileManagerOpen(true)}
              type="button"
            >
              <Edit className="h-5 w-5 text-white" />
            </button>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            {isVerified && <CheckCircle className="h-5 w-5 text-green-500" />}
          </div>
          <p className="text-sm font-medium text-gray-600">{role}</p>
          <p className="text-sm text-gray-500">{location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasChanges && onSave && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Avatar"}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}
