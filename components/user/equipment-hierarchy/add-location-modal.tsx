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
import { useEquipmentStore } from "@/store/equipment-store";

export function AddLocationModal() {
  const [locationName, setLocationName] = useState("");
  const {
    setShowAddLocationModal,
    addLocation,
    showFloatingButtons,
    showAddLocationModal,
  } = useEquipmentStore();

  const handleSave = () => {
    if (locationName.trim() && showFloatingButtons) {
      addLocation(showFloatingButtons, locationName.trim());
      setLocationName("");
      setShowAddLocationModal(false);
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

        <div className="space-y-4">
          <div>
            <Label htmlFor="location-name" className="text-sm font-medium">
              Add location to manufacturing plant{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div className="mt-1 relative">
              <Input
                id="location-name"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Assembly Building B"
                className="pr-10"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} className="flex-1">
            Save
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 bg-transparent"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
