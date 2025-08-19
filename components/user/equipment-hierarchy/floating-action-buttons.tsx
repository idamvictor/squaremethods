"use client";

import { Folder, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEquipmentStore, type HierarchyNode } from "@/store/equipment-store";

interface FloatingActionButtonsProps {
  nodeId: string;
}

export function FloatingActionButtons({ nodeId }: FloatingActionButtonsProps) {
  const {
    setShowAddLocationModal,
    setShowAddEquipmentModal,
    setShowFloatingButtons,
  } = useEquipmentStore();

  const handleAddLocation = () => {
    setShowAddLocationModal(true);
    setShowFloatingButtons(null);
    useEquipmentStore
      .getState()
      .setSelectedNode({ id: nodeId, type: "location" } as HierarchyNode);
  };

  const handleAddEquipment = () => {
    setShowAddEquipmentModal(true);
    setShowFloatingButtons(null);
    useEquipmentStore
      .getState()
      .setSelectedNode({ id: nodeId, type: "assembly" } as HierarchyNode);
  };

  return (
    <div className="absolute right-8 top-0 flex gap-2 bg-white shadow-lg rounded-lg p-2 border z-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddLocation}
        className="flex items-center gap-2 text-sm"
      >
        <Folder className="h-4 w-4" />
        Add Location
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleAddEquipment}
        className="flex items-center gap-2 text-sm"
      >
        <Settings className="h-4 w-4" />
        Add Equipment
      </Button>
    </div>
  );
}
