"use client";

import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const allowedDocumentTypes = [
    "application/pdf", // PDF
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "text/plain", // .txt
    "text/csv", // .csv
  ];

  const handleFile = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isDocument =
      allowedDocumentTypes.includes(file.type) ||
      [
        ".pdf",
        ".doc",
        ".docx",
        ".xls",
        ".xlsx",
        ".ppt",
        ".pptx",
        ".txt",
        ".csv",
      ].some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isImage && !isDocument) {
      alert(
        "Please upload an image or document file (PDF, Word, Excel, PowerPoint, Text, CSV)",
      );
      return;
    }
    onUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type !== "dragleave");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
        dragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
        onChange={handleChange}
        className="hidden"
      />

      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
      >
        <>
          <Upload className="mr-2 h-4 w-4" />
          Click to upload or drag and drop
        </>
      </Button>
      <p className="mt-2 text-sm text-muted-foreground">
        PNG, JPG, GIF, PDF, Word, Excel, PowerPoint, Text, or CSV
      </p>
    </div>
  );
}
