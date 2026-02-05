"use client";

import React from "react";
import { useEquipmentStore } from "@/store/equipment-store";
import { EquipmentDetails } from "@/components/user/equipment-hierarchy/equipment-details";

export default function EquipmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { selectedNode, findNodeById, hierarchy, setSelectedNode } =
    useEquipmentStore();

  const { breadcrumbs } = useEquipmentStore();

  React.useEffect(() => {
    if (hierarchy.length > 0 && params.id) {
      const node = findNodeById(params.id, hierarchy);
      if (node) {
        setSelectedNode(node);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (!selectedNode) {
    return (
      <div className="text-center text-gray-500 mt-20">
        <h2 className="text-xl font-semibold mb-2">Equipment Not Found</h2>
        <p>Please select a location or equipment from the sidebar</p>
      </div>
    );
  }

  return (
    <div>
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-blue-100 p-2 rounded-md">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.id} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              <span>{crumb.name}</span>
            </div>
          ))}
        </div>
      )}
      <EquipmentDetails node={selectedNode} />
    </div>
  );
}
