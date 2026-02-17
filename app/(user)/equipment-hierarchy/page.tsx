"use client";

import { useEquipmentStore } from "@/store/equipment-store";
import { EquipmentDetails } from "@/components/user/equipment-hierarchy/equipment-details";

function Breadcrumbs() {
  const { breadcrumbs } = useEquipmentStore();

  if (breadcrumbs.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-blue-100 p-2 rounded-md">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.id} className="flex items-center gap-2">
          {index > 0 && <span>/</span>}
          <span>{crumb.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function EquipmentHierarchyPage() {
  const { selectedNode } = useEquipmentStore();

  if (!selectedNode) {
    return (
      <div className="text-center text-gray-500 mt-20">
        <h2 className="text-xl font-semibold mb-2">Equipment Hierarchy</h2>
        <p>Select a location or equipment from the sidebar to view details</p>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs />
      <EquipmentDetails node={selectedNode} />
    </div>
  );
}
