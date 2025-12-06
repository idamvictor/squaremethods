"use client";

import { useState } from "react";
import type { FileItem } from "@/lib/static-files";
import { STATIC_FILES } from "@/lib/static-files";
import { FileUpload } from "./file-upload";
import { FileList } from "./file-list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileSelect: (fileUrl: string) => void;
}

export function FileManagerModal({
  open,
  onOpenChange,
  onFileSelect,
}: FileManagerModalProps) {
  const [files, setFiles] = useState<FileItem[]>(STATIC_FILES);

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSelect = (file: FileItem) => {
    onFileSelect(file.url);
    onOpenChange(false);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: file.name,
        url: e.target?.result as string,
        createdAt: new Date().toISOString(),
        size: file.size,
      };
      setFiles((prev) => [newFile, ...prev]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>File Manager</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse Files</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-4">
            <FileList
              files={files}
              onDelete={handleDelete}
              onSelect={handleSelect}
            />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <FileUpload onUpload={handleUpload} />
            {files.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium">Recently Uploaded</p>
                <FileList
                  files={files.slice(0, 3)}
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
