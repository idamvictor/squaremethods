"use client";

import { useState } from "react";
import { Folder, Settings, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEquipmentStore } from "@/store/equipment-store";
import { useDeleteLocation } from "@/services/locations/location-queries";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { UpdateLocationModal } from "./update-location-modal";

interface FloatingActionButtonsProps {
  node: {
    id: string;
    name: string;
  };
}

export function FloatingActionButtons({ node }: FloatingActionButtonsProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { fetchHierarchy, clearSelection } = useEquipmentStore();
  const deleteLocation = useDeleteLocation();

  const handleAddLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    const store = useEquipmentStore.getState();
    store.setShowFloatingButtons(node.id);
    store.setParentLocationName(node.name);
    store.setShowAddLocationModal(true);
  };

  const handleAddEquipment = (e: React.MouseEvent) => {
    e.stopPropagation();
    const store = useEquipmentStore.getState();
    store.setShowFloatingButtons(node.id);
    store.setShowAddEquipmentModal(true);
  };

  const handleUpdateLocation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUpdateModal(true);
  };

  const handleDeleteLocation = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteLocation.mutateAsync(node.id);

      if (response.status === "success") {
        // Clear selected node and breadcrumbs before refreshing
        clearSelection();
        toast.success(response.message);
        await fetchHierarchy();
        setShowDeleteAlert(false);
      } else {
        toast.error(response.message || "Failed to delete location");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete location"
      );
    }
  };
  return (
    <>
      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Popover>
          <PopoverTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Plus className="h-4 w-4 text-blue-600" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" side="right">
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddLocation}
                className="flex items-center gap-2 text-sm justify-start"
              >
                <Folder className="h-4 w-4" />
                Add Location
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddEquipment}
                className="flex items-center gap-2 text-sm justify-start"
              >
                <Settings className="h-4 w-4" />
                Add Equipment
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 hover:bg-gray-200 rounded ml-1"
            >
              <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            <DropdownMenuItem onClick={handleUpdateLocation}>
              <Pencil className="h-4 w-4 mr-2" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteLocation}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <UpdateLocationModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        locationId={node.id}
        locationName={node.name}
      />

      <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              This will permanently delete the location &ldquo;{node.name}
              &rdquo; and all its contents. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              variant="destructive"
              disabled={deleteLocation.isPending}
            >
              {deleteLocation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
