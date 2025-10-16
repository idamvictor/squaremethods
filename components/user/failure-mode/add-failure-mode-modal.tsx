"use client";

import type React from "react";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Maximize2, X, Plus, Trash2, ImageIcon } from "lucide-react";

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
  const [reportedBy, setReportedBy] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const handleSubmit = () => {
    onSubmit({
      title,
      resolutions,
      equipment,
      reportedBy,
      dueDate,
      image: imagePreview,
    });
    // Reset form
    setTitle("");
    setResolutions([]);
    setNewResolution("");
    setEquipment("");
    setReportedBy("");
    setDueDate("");
    setImagePreview(null);
    onOpenChange(false);
  };

  return (
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
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
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted"
                >
                  <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
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
              <Label htmlFor="equipment">Attached Equipment</Label>
              <Select value={equipment} onValueChange={setEquipment}>
                <SelectTrigger id="equipment">
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pump-a">Pump A</SelectItem>
                  <SelectItem value="valve-b">Valve B</SelectItem>
                  <SelectItem value="compressor-c">Compressor C</SelectItem>
                  <SelectItem value="motor-d">Motor D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Team */}
            {/* Reported By */}
            <div className="space-y-2">
              <Label htmlFor="reportedBy">Reported By</Label>
              <Select value={reportedBy} onValueChange={setReportedBy}>
                <SelectTrigger id="reportedBy">
                  <SelectValue placeholder="Select who reported" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Olivia Rhye">Olivia Rhye</SelectItem>
                  <SelectItem value="Phoenix Baker">Phoenix Baker</SelectItem>
                  <SelectItem value="Lana Steiner">Lana Steiner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Select value={dueDate} onValueChange={setDueDate}>
                <SelectTrigger id="dueDate">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="May 24">May 24</SelectItem>
                  <SelectItem value="May 25">May 25</SelectItem>
                  <SelectItem value="May 26">May 26</SelectItem>
                  <SelectItem value="May 27">May 27</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4">
          <Button
            onClick={handleSubmit}
            disabled={!title}
            className="w-full bg-[#1e293b] hover:bg-[#334155]"
          >
            Create Failure Mode
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
