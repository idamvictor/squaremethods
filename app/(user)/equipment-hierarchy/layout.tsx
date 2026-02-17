"use client";

import React from "react";
import {
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  useEquipmentStore,
  equipmentTypeIcons,
  type HierarchyNode,
} from "@/store/equipment-store";
import { FloatingActionButtons } from "@/components/user/equipment-hierarchy/floating-action-buttons";
import { EquipmentActionButtons } from "@/components/user/equipment-hierarchy/equipment-action-buttons";
import { cn } from "@/lib/utils";
import { AddLocationModal } from "@/components/user/equipment-hierarchy/add-location-modal";
import { AddEquipmentModal } from "@/components/user/equipment-hierarchy/add-equipment-modal";
import { EditEquipmentModal } from "@/components/user/equipment-hierarchy/edit-equipment-modal";
import { Button } from "@/components/ui/button";

const getEquipmentIcon = (type: string) => {
  if (type === "location") return null;
  return equipmentTypeIcons[type as keyof typeof equipmentTypeIcons] || "⚙️";
};

const getEquipmentColor = (type: string) => {
  const colors = {
    pump: "text-blue-600",
    assembly: "text-orange-600",
    conveyor: "text-green-600",
    motor: "text-purple-600",
    valve: "text-red-600",
    sensor: "text-yellow-600",
  };
  return colors[type as keyof typeof colors] || "text-gray-600";
};

interface TreeNodeProps {
  node: HierarchyNode;
  level: number;
}

function TreeNode({ node, level }: TreeNodeProps) {
  const { expandedNodes, toggleExpanded, setSelectedNode } =
    useEquipmentStore();

  const isExpanded = expandedNodes.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      toggleExpanded(node.id);
    }
  };

  const handleSelect = () => {
    setSelectedNode(node);
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 py-1 px-2 hover:bg-gray-50 cursor-pointer relative group",
          level > 0 && "ml-4",
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleSelect}
      >
        <div className="flex items-center gap-1 flex-1">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              className="p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-5" />
          )}

          {node.type === "location" ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-blue-600" />
            ) : (
              <Folder className="h-4 w-4 text-blue-600" />
            )
          ) : (
            <span className={cn("text-lg", getEquipmentColor(node.type))}>
              {getEquipmentIcon(node.type)}
            </span>
          )}

          <span className="text-sm text-gray-700">{node.name}</span>
        </div>

        {node.type === "location" ? (
          <FloatingActionButtons node={node} />
        ) : (
          <EquipmentActionButtons node={node} />
        )}
      </div>

      {isExpanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function EquipmentHierarchyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    hierarchy,
    searchQuery,
    setSearchQuery,
    showAddLocationModal,
    showAddEquipmentModal,
    isLoading,
    error,
    fetchHierarchy,
    isEditingEquipment,
    setIsEditingEquipment,
    editingEquipment,
    setEditingEquipment,
  } = useEquipmentStore();

  React.useEffect(() => {
    fetchHierarchy();
  }, [fetchHierarchy]);

  if (isEditingEquipment && editingEquipment) {
    return (
      <div className="flex flex-col h-screen bg-white p-4">
        <div className="mb-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => {
              setIsEditingEquipment(false);
              setEditingEquipment(null);
            }}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Equipment
          </Button>
        </div>
        <div className="bg-white rounded-lg p-6">
          <EditEquipmentModal />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white p-4">
      {/* Header */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            Equipment Hierarchy
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-80 flex flex-col">
          <div className="flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex-1 overflow-auto">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-blue-600">
                    Location
                  </span>
                  <button
                    onClick={() => {
                      const store = useEquipmentStore.getState();
                      store.setShowFloatingButtons("root");
                      store.setParentLocationName(null);
                      store.setShowAddLocationModal(true);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Plus className="h-4 w-4 text-blue-600" />
                  </button>
                </div>

                <div className="space-y-1">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4 text-blue-600">
                      <Loader2 className="h-6 w-6 animate-spin mr-2" />
                      <span>Loading hierarchy...</span>
                    </div>
                  ) : error ? (
                    <div className="text-red-600 p-4">{error}</div>
                  ) : hierarchy.length === 0 ? (
                    <div className="text-gray-500 p-4">
                      No locations or equipment found
                    </div>
                  ) : (
                    hierarchy.map((node) => (
                      <TreeNode key={node.id} node={node} level={0} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-6">{children}</div>

        {/* Modals */}
        {showAddLocationModal && <AddLocationModal />}
        {showAddEquipmentModal && <AddEquipmentModal />}
      </div>
    </div>
  );
}
