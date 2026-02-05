import { create } from "zustand";
import { toast } from "sonner";
import { fetchLocationsWithEquipment } from "@/services/locations/location-queries";
import type {
  Location as APILocation,
  Equipment as APIEquipment,
} from "@/services/locations/location-types";

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
  showEditEquipmentModal: boolean;
  editingEquipment: HierarchyNode | null;
  showFloatingButtons: string | null;
  parentLocationName: string | null;
  searchQuery: string;
  breadcrumbs: { id: string; name: string }[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchHierarchy: () => Promise<void>;
  setSelectedNode: (node: HierarchyNode | null) => void;
  clearSelection: () => void;
  toggleExpanded: (nodeId: string) => void;
  setShowAddLocationModal: (show: boolean) => void;
  setShowAddEquipmentModal: (show: boolean) => void;
  setShowEditEquipmentModal: (show: boolean) => void;
  setEditingEquipment: (equipment: HierarchyNode | null) => void;
  setShowFloatingButtons: (nodeId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setParentLocationName: (name: string | null) => void;
  addLocation: (parentId: string, name: string) => void;
  addEquipment: (
    parentId: string,
    equipment: Omit<Equipment, "id" | "parentId">,
  ) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  generateQRCode: (equipmentId: string) => void;
  setBreadcrumbs: (breadcrumbs: { id: string; name: string }[]) => void;
  findNodePath: (nodeId: string) => { id: string; name: string }[];
  findNodeById: (
    nodeId: string,
    nodes: HierarchyNode[],
  ) => HierarchyNode | null;
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
  hierarchy: [],
  isLoading: false,
  error: null,
  selectedNode: null,
  expandedNodes: new Set([
    "manufacturing-plant",
    "assembly-building-b",
    "conveyor-system",
  ]),
  showAddLocationModal: false,
  showAddEquipmentModal: false,
  showEditEquipmentModal: false,
  editingEquipment: null,
  showFloatingButtons: null,
  parentLocationName: null,
  searchQuery: "",
  breadcrumbs: [],

  // Actions
  clearSelection: () => {
    set({ selectedNode: null, breadcrumbs: [] });
  },

  setSelectedNode: (node) => {
    set({ selectedNode: node });
    if (node) {
      const breadcrumbs = get().findNodePath(node.id);
      set({ breadcrumbs });
    } else {
      set({ breadcrumbs: [] });
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
  setShowEditEquipmentModal: (show) => set({ showEditEquipmentModal: show }),
  setEditingEquipment: (equipment) => set({ editingEquipment: equipment }),
  setShowFloatingButtons: (nodeId) => set({ showFloatingButtons: nodeId }),
  setParentLocationName: (name) => set({ parentLocationName: name }),
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
      path: { id: string; name: string }[] = [],
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

  findNodeById: (nodeId, nodes) => {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }

      if (node.children) {
        const found = get().findNodeById(nodeId, node.children);
        if (found) return found;
      }
    }
    return null;
  },

  fetchHierarchy: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetchLocationsWithEquipment();

      // Transform the API response to match our HierarchyNode structure
      const transformLocation = (location: APILocation): HierarchyNode => {
        // Transform child locations
        const locationChildren =
          location.children?.map(transformLocation) || [];

        // Transform equipment
        const equipmentChildren = (location.equipment || []).map(
          (eq: APIEquipment): HierarchyNode => ({
            id: eq.id,
            name: eq.name,
            type: determineEquipmentType(eq.status), // Helper function to determine type
            parentId: location.id,
            referenceCode: eq.reference_code,
            date: new Date().toLocaleDateString(),
            notes: "",
            image: eq.image || undefined,
          }),
        );

        return {
          id: location.id,
          name: location.name,
          type: "location" as const,
          parentId: location.parent_location_id || undefined,
          children: [...locationChildren, ...equipmentChildren],
        };
      };

      // Helper function to determine equipment type based on status
      const determineEquipmentType = (status: string): EquipmentType => {
        // You can customize this mapping based on your needs
        const typeMap: Record<string, EquipmentType> = {
          active: "assembly",
          maintenance: "pump",
          offline: "motor",
          // Add more mappings as needed
        };
        return typeMap[status.toLowerCase()] || "assembly";
      };

      const hierarchyData = response.data.map(transformLocation);
      set({ hierarchy: hierarchyData });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "An error occurred while fetching the hierarchy",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export { equipmentTypeIcons };
