"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EquipmentHierarchy } from "@/components/user/equipment-hierarchy/equipment-hierarchy";
import { useEquipmentStore } from "@/store/equipment-store";

interface EquipmentHierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttach: (equipmentId: string, equipmentName: string) => void;
}

export function EquipmentHierarchyModal({
  isOpen,
  onClose,
  onAttach,
}: EquipmentHierarchyModalProps) {
  const { selectedNode } = useEquipmentStore();

  const handleAttach = () => {
    if (selectedNode && selectedNode.type !== "location") {
      onAttach(selectedNode.id, selectedNode.name);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[95vw] !w-[1400px] max-h-[80vh] p-6 flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between mb-4">
          <DialogTitle>Select Equipment</DialogTitle>
          <Button
            onClick={handleAttach}
            disabled={!selectedNode || selectedNode.type === "location"}
            className="bg-[#39447A] hover:bg-[#2d355f] text-white"
          >
            Attach Equipment
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <EquipmentHierarchy />
        </div>
      </DialogContent>
    </Dialog>
  );
}
