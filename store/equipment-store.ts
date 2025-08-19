import { create } from "zustand";
import { toast } from "sonner";

export type EquipmentType =
  | "assembly"
  | "pump"
  | "conveyor"
  | "motor"
  | "valve"
  | "sensor";

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  referenceCode: string;
  date: string;
  notes: string;
  image?: string;
  qrCode?: string;
  parentId: string;
}

export interface Location {
  id: string;
  name: string;
  type: "location";
  parentId?: string;
  children: (Location | Equipment)[];
}

export interface HierarchyNode {
  id: string;
  name: string;
  type: "location" | EquipmentType;
  parentId?: string;
  children?: HierarchyNode[];
  // Equipment specific fields
  referenceCode?: string;
  date?: string;
  notes?: string;
  image?: string;
  qrCode?: string;
}

interface EquipmentStore {
  // State
  hierarchy: HierarchyNode[];
  selectedNode: HierarchyNode | null;
  expandedNodes: Set<string>;
  showAddLocationModal: boolean;
  showAddEquipmentModal: boolean;
  showFloatingButtons: string | null;
  searchQuery: string;
  breadcrumbs: { id: string; name: string }[];

  // Actions
  setSelectedNode: (node: HierarchyNode | null) => void;
  toggleExpanded: (nodeId: string) => void;
  setShowAddLocationModal: (show: boolean) => void;
  setShowAddEquipmentModal: (show: boolean) => void;
  setShowFloatingButtons: (nodeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  addLocation: (parentId: string, name: string) => void;
  addEquipment: (
    parentId: string,
    equipment: Omit<Equipment, "id" | "parentId">
  ) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  generateQRCode: (equipmentId: string) => void;
  setBreadcrumbs: (breadcrumbs: { id: string; name: string }[]) => void;
  findNodePath: (nodeId: string) => { id: string; name: string }[];
}

const equipmentTypeIcons: Record<EquipmentType, string> = {
  assembly: "⚙️",
  pump: "🔧",
  conveyor: "📦",
  motor: "⚡",
  valve: "🔩",
  sensor: "📡",
};

export const useEquipmentStore = create<EquipmentStore>((set, get) => ({
  // Initial state
  hierarchy: [
    {
      id: "manufacturing-plant",
      name: "Manufacturing Plant",
      type: "location",
      children: [
        {
          id: "assembly-building-b",
          name: "Assembly Building B",
          type: "location",
          parentId: "manufacturing-plant",
          children: [
            {
              id: "conveyor-system",
              name: "Conveyor System",
              type: "location",
              parentId: "assembly-building-b",
              children: [
                {
                  id: "pump-station-12-1",
                  name: "Pump Station 12",
                  type: "pump",
                  parentId: "conveyor-system",
                  referenceCode: "54635bd",
                  date: "14/05/2025",
                  notes: "Cooling pump for assembly line",
                },
                {
                  id: "pump-station-12-2",
                  name: "Pump Station 12",
                  type: "assembly",
                  parentId: "conveyor-system",
                  referenceCode: "54636cd",
                  date: "15/05/2025",
                  notes: "Assembly station for conveyor system",
                },
              ],
            },
            {
              id: "pump-station-12-3",
              name: "Pump Station 12",
              type: "location",
              parentId: "assembly-building-b",
            },
          ],
        },
        {
          id: "north-production-line",
          name: "North Production Line",
          type: "location",
          parentId: "manufacturing-plant",
        },
      ],
    },
    {
      id: "oil-gas-refinery",
      name: "Oil & Gas Refinery",
      type: "location",
    },
    {
      id: "water-treatment-plant",
      name: "Water Treatment Plant",
      type: "location",
    },
  ],
  selectedNode: null,
  expandedNodes: new Set([
    "manufacturing-plant",
    "assembly-building-b",
    "conveyor-system",
  ]),
  showAddLocationModal: false,
  showAddEquipmentModal: false,
  showFloatingButtons: null,
  searchQuery: "",
  breadcrumbs: [],

  // Actions
  setSelectedNode: (node) => {
    set({ selectedNode: node });
    if (node) {
      const breadcrumbs = get().findNodePath(node.id);
      set({ breadcrumbs });
    }
  },

  toggleExpanded: (nodeId) => {
    const expanded = new Set(get().expandedNodes);
    if (expanded.has(nodeId)) {
      expanded.delete(nodeId);
    } else {
      expanded.add(nodeId);
    }
    set({ expandedNodes: expanded });
  },

  setShowAddLocationModal: (show) => set({ showAddLocationModal: show }),
  setShowAddEquipmentModal: (show) => set({ showAddEquipmentModal: show }),
  setShowFloatingButtons: (nodeId) => set({ showFloatingButtons: nodeId }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addLocation: (parentId, name) => {
    const newLocation: HierarchyNode = {
      id: `location-${Date.now()}`,
      name,
      type: "location",
      parentId,
      children: [],
    };

    const addToHierarchy = (nodes: HierarchyNode[]): HierarchyNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newLocation],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addToHierarchy(node.children),
          };
        }
        return node;
      });
    };

    set({ hierarchy: addToHierarchy(get().hierarchy) });
    toast.success("Location added successfully");
  },

  addEquipment: (parentId, equipment) => {
    const newEquipment: HierarchyNode = {
      id: `equipment-${Date.now()}`,
      name: equipment.name,
      type: equipment.type,
      parentId,
      referenceCode: equipment.referenceCode,
      date: equipment.date,
      notes: equipment.notes,
      image: equipment.image,
    };

    const addToHierarchy = (nodes: HierarchyNode[]): HierarchyNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newEquipment],
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addToHierarchy(node.children),
          };
        }
        return node;
      });
    };

    set({ hierarchy: addToHierarchy(get().hierarchy) });
    toast.success("Equipment registered successfully");
  },

  updateEquipment: (id, updates) => {
    const updateInHierarchy = (nodes: HierarchyNode[]): HierarchyNode[] => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, ...updates };
        }
        if (node.children) {
          return {
            ...node,
            children: updateInHierarchy(node.children),
          };
        }
        return node;
      });
    };

    set({ hierarchy: updateInHierarchy(get().hierarchy) });
  },

  generateQRCode: (equipmentId) => {
    // Simulate QR code generation
    const qrCode = `data:image/svg+xml,${encodeURIComponent(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <rect x="10" y="10" width="10" height="10" fill="black"/>
        <rect x="30" y="10" width="10" height="10" fill="black"/>
        <rect x="50" y="10" width="10" height="10" fill="black"/>
        <rect x="70" y="10" width="10" height="10" fill="black"/>
        <rect x="10" y="30" width="10" height="10" fill="black"/>
        <rect x="50" y="30" width="10" height="10" fill="black"/>
        <rect x="10" y="50" width="10" height="10" fill="black"/>
        <rect x="30" y="50" width="10" height="10" fill="black"/>
        <rect x="70" y="50" width="10" height="10" fill="black"/>
        <rect x="10" y="70" width="10" height="10" fill="black"/>
        <rect x="30" y="70" width="10" height="10" fill="black"/>
        <rect x="50" y="70" width="10" height="10" fill="black"/>
        <rect x="70" y="70" width="10" height="10" fill="black"/>
      </svg>
    `)}`;

    get().updateEquipment(equipmentId, { qrCode });
    toast.success("QR Code generated successfully");
  },

  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),

  findNodePath: (nodeId) => {
    const findPath = (
      nodes: HierarchyNode[],
      targetId: string,
      path: { id: string; name: string }[] = []
    ): { id: string; name: string }[] | null => {
      for (const node of nodes) {
        const currentPath = [...path, { id: node.id, name: node.name }];

        if (node.id === targetId) {
          return currentPath;
        }

        if (node.children) {
          const result = findPath(node.children, targetId, currentPath);
          if (result) return result;
        }
      }
      return null;
    };

    return findPath(get().hierarchy, nodeId) || [];
  },
}));

export { equipmentTypeIcons };
