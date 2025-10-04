"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useEquipmentStore } from "@/store/equipment-store";
import { useUpdateLocation } from "@/services/locations/location-queries";
import { Loader2 } from "lucide-react";

interface UpdateLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationId: string;
  locationName: string;
}

export function UpdateLocationModal({
  isOpen,
  onClose,
  locationId,
  locationName,
}: UpdateLocationModalProps) {
  const [name, setName] = useState(locationName);
  const { fetchHierarchy, setSelectedNode } = useEquipmentStore();
  const updateLocation = useUpdateLocation();

  useEffect(() => {
    setName(locationName);
  }, [locationName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Location name is required");
      return;
    }

    try {
      const response = await updateLocation.mutateAsync({
        id: locationId,
        name: name.trim(),
        icon: null, // Include icon field as it's part of the UpdateLocationInput type
        parent_location_id: null, // Keep the same parent location
      });

      if (response.status === "success") {
        toast.success(response.message || "Location updated successfully");
        await fetchHierarchy();

        // Update selected node with new name if it's the one being edited
        setSelectedNode({
          id: locationId,
          name: name.trim(),
          type: "location",
        });

        onClose();
      } else {
        toast.error(response.message || "Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update location"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Location</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="location-name" className="text-sm font-medium">
                Location name <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="location-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pr-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={updateLocation.isPending || !name.trim()}
            >
              {updateLocation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
