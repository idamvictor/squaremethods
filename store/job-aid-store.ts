import { create } from "zustand"
import type { JobAid, JobAidFilters, JobAidProcedure } from "@/types/job-aid"

interface JobAidStore {
  jobAids: JobAid[]
  filters: JobAidFilters
  searchQuery: string
  viewMode: "grid" | "list"
  setFilter: (key: keyof JobAidFilters, value: string) => void
  resetFilters: () => void
  setSearchQuery: (query: string) => void
  setViewMode: (mode: "grid" | "list") => void
  addJobAid: (jobAid: JobAid) => void
  updateJobAid: (id: string, updates: Partial<JobAid>) => void
  deleteJobAid: (id: string) => void
  getJobAidById: (id: string) => JobAid | undefined
  getFilteredJobAids: () => JobAid[]
}

const initialFilters: JobAidFilters = {
  count: "50",
  equipment: "all",
  category: "all",
}

// Generate comprehensive mock data
const generateMockJobAids = (): JobAid[] => {
  const titles = [
    "Monthly Safety Inspection",
    "Equipment Maintenance Check",
    "Emergency Shutdown Procedure",
    "Quality Control Assessment",
    "Preventive Maintenance",
    "Safety Protocol Review",
    "Equipment Calibration",
    "Operational Safety Check",
  ]

  const equipmentTypes = [
    "Hydraulic Press",
    "Conveyor System",
    "Industrial Pump",
    "Control Panel",
    "Safety Valve",
    "Motor Assembly",
    "Electrical Panel",
    "Pressure Gauge",
  ]

  const categories = [
    "Monthly Maintenance",
    "Safety Inspection",
    "Emergency Procedures",
    "Quality Control",
    "Equipment Setup",
  ]

  const authors = ["Andy Miracle", "Sarah Johnson", "Mike Chen", "Lisa Rodriguez", "David Kim", "Emma Wilson"]

  const locations = [
    "Manufacturing plant",
    "Assembly line A",
    "Quality control lab",
    "Maintenance shop",
    "Production floor",
    "Testing facility",
  ]

  const images = [
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
    "/placeholder.svg?height=200&width=300",
  ]

  return Array.from({ length: 24 }, (_, index) => {
    const procedures: JobAidProcedure[] = [
      {
        id: `proc-${index}-1`,
        title: `${equipmentTypes[index % equipmentTypes.length]} change over`,
        steps: Array.from({ length: 11 }, (_, stepIndex) => ({
          id: `step-${index}-${stepIndex}`,
          title: `Step ${stepIndex + 1}`,
          description: `Detailed instruction for step ${stepIndex + 1} of the procedure`,
          order: stepIndex + 1,
        })),
      },
      {
        id: `proc-${index}-2`,
        title: `${equipmentTypes[index % equipmentTypes.length]} reboot`,
        steps: Array.from({ length: 11 }, (_, stepIndex) => ({
          id: `step-${index}-${stepIndex + 11}`,
          title: `Step ${stepIndex + 1}`,
          description: `Detailed instruction for step ${stepIndex + 1} of the reboot procedure`,
          order: stepIndex + 1,
        })),
      },
    ]

    return {
      id: `job-aid-${index + 1}`,
      title: titles[index % titles.length],
      subtitle: equipmentTypes[index % equipmentTypes.length],
      category: categories[index % categories.length],
      author: authors[index % authors.length],
      dateCreated: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toLocaleDateString(),
      image: images[index % images.length],
      assignedEquipment: {
        name: `${equipmentTypes[index % equipmentTypes.length]} engine`,
        image: images[index % images.length],
        type: "Sub Assembly",
        location: locations[index % locations.length],
      },
      safetyPrecautions: [
        "Ensure all power sources are disconnected",
        "Wear appropriate personal protective equipment",
        "Follow lockout/tagout procedures",
        "Verify equipment is in safe state before proceeding",
      ],
      procedures,
      viewCount: Math.floor(Math.random() * 1000) + 50,
      isRecent: index < 8,
    }
  })
}

export const useJobAidStore = create<JobAidStore>((set, get) => ({
  jobAids: generateMockJobAids(),
  filters: initialFilters,
  searchQuery: "",
  viewMode: "grid",

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({
      filters: initialFilters,
      searchQuery: "",
    }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setViewMode: (mode) => set({ viewMode: mode }),

  addJobAid: (jobAid) =>
    set((state) => ({
      jobAids: [jobAid, ...state.jobAids],
    })),

  updateJobAid: (id, updates) =>
    set((state) => ({
      jobAids: state.jobAids.map((jobAid) => (jobAid.id === id ? { ...jobAid, ...updates } : jobAid)),
    })),

  deleteJobAid: (id) =>
    set((state) => ({
      jobAids: state.jobAids.filter((jobAid) => jobAid.id !== id),
    })),

  getJobAidById: (id) => {
    const { jobAids } = get()
    return jobAids.find((jobAid) => jobAid.id === id)
  },

  getFilteredJobAids: () => {
    const { jobAids, filters, searchQuery } = get()

    return jobAids.filter((jobAid) => {
      // Search filter
      if (
        searchQuery &&
        !jobAid.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !jobAid.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      // Equipment filter
      if (
        filters.equipment !== "all" &&
        jobAid.assignedEquipment.type.toLowerCase() !== filters.equipment.toLowerCase()
      ) {
        return false
      }

      // Category filter
      if (filters.category !== "all") {
        if (filters.category === "recent" && !jobAid.isRecent) return false
        if (filters.category === "most-viewed" && jobAid.viewCount < 500) return false
      }

      return true
    })
  },
}))
