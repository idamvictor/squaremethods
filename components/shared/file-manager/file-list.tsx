"use client";

import type { FileItem } from "@/lib/static-files";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Image from "next/image";

interface FileListProps {
  files: FileItem[];
  onDelete: (id: string) => void;
  onSelect: (file: FileItem) => void;
}

export function FileList({ files, onDelete, onSelect }: FileListProps) {
  console.log("Rendering FileList with files:", files);
  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No files yet. Upload one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
      {files.map((file, index) => (
        <div
          key={file.id || `file-${index}`}
          className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer ring-1 ring-border shadow-md hover:shadow-lg transition-all hover:ring-2 hover:ring-primary"
          onClick={() => onSelect(file)}
        >
          {file.url && file.url.startsWith("data:") ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : file.url &&
            (file.url.startsWith("http://") ||
              file.url.startsWith("https://") ||
              file.url.startsWith("/")) ? (
            <Image
              src={file.url}
              alt={file.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-400">No preview</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file.id);
            }}
            className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100 bg-black/50 hover:bg-black/70 text-white"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
