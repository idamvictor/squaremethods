"use client";

import { useEquipmentStore } from "@/store/equipment-store";

export function Breadcrumbs() {
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
