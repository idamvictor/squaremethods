"use client";

import { useState } from "react";
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
import { useCreateLocation } from "@/services/locations/location-queries";
import { Loader2 } from "lucide-react";

export function AddLocationModal() {
  const [locationName, setLocationName] = useState("");
  const {
    setShowAddLocationModal,
    showFloatingButtons,
    showAddLocationModal,
    fetchHierarchy,
    parentLocationName,
  } = useEquipmentStore();

  const createLocation = useCreateLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { locationName, showFloatingButtons });

    if (!locationName.trim()) {
      toast.error("Location name is required");
      return;
    }

    try {
      const parentId = showFloatingButtons || "root";
      console.log("Creating location...", {
        name: locationName.trim(),
        parent_location_id: parentId === "root" ? undefined : parentId,
      });

      await createLocation.mutateAsync({
        name: locationName.trim(),
        parent_location_id: parentId === "root" ? undefined : parentId,
      });

      toast.success("Location created successfully");

      // Refresh the hierarchy data
      await fetchHierarchy();

      // Clear form and close modal
      setLocationName("");
      setShowAddLocationModal(false);
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create location"
      );
    }
  };

  const handleCancel = () => {
    setLocationName("");
    setShowAddLocationModal(false);
  };

  return (
    <Dialog open={showAddLocationModal} onOpenChange={setShowAddLocationModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Functional location</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 mb-4">
          You&apos;re allowed to add as much as possible.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="location-name" className="text-sm font-medium">
                {showFloatingButtons === "root"
                  ? "Add root location"
                  : `Add location to ${parentLocationName}`}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="location-name"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Assembly Building B"
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
              disabled={createLocation.isPending || !locationName.trim()}
            >
              {createLocation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Save"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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
