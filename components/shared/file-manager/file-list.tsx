"use client"

import type { FileItem } from "@/lib/static-files"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import Image from "next/image"

interface FileListProps {
  files: FileItem[]
  onDelete: (id: string) => void
  onSelect: (file: FileItem) => void
}

export function FileList({ files, onDelete, onSelect }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">No files yet. Upload one to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-3 max-h-96 overflow-y-auto">
      {files.map((file) => (
        <div
          key={file.id}
          className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted cursor-pointer"
          onClick={() => onSelect(file)}
        >
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-xs text-muted-foreground">{new Date(file.createdAt).toLocaleDateString()}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(file.id)
            }}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
