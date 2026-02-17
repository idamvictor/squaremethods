"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteEquipment } from "@/services/equipment/equipment-queries";
import { toast } from "sonner";
import { HierarchyNode } from "@/store/equipment-store";
import { useEquipmentStore } from "@/store/equipment-store";

interface EquipmentActionButtonsProps {
  node: HierarchyNode;
}

export function EquipmentActionButtons({ node }: EquipmentActionButtonsProps) {
  const deleteEquipmentMutation = useDeleteEquipment();
  const store = useEquipmentStore();

  const handleDelete = async () => {
    try {
      await deleteEquipmentMutation.mutateAsync(node.id);
      await store.fetchHierarchy();
      store.setSelectedNode(null);
      toast.success("Equipment deleted successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete equipment");
      }
    }
  };

  const handleEdit = () => {
    store.setEditingEquipment(node);
    store.setIsEditingEquipment(true);
  };

  return (
    <>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-gray-200 rounded">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
