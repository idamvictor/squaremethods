import { create } from "zustand";
import type { Team, TeamFilters } from "@/types/team";

interface TeamStore {
  teams: Team[];
  filters: TeamFilters;
  setFilter: (key: keyof TeamFilters, value: string) => void;
  resetFilters: () => void;
  addTeam: (team: Team) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
}

const initialFilters: TeamFilters = {
  count: "50",
  category: "all",
};

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Maintenance Team",
    memberCount: 4,
    lastActivity: "Mar 23",
    members: [
      {
        id: "1",
        name: "John Doe",
        avatar: "/avatars/phoenix.jpg",
        role: "Team Lead",
        email: "john.doe@company.com",
        contact: "+1 (555) 123-4567",
        dateEntered: "2024-01-15",
      },
      {
        id: "2",
        name: "Jane Smith",
        avatar: "/avatars/olivia.jpg",
        role: "Maintenance Technician",
        email: "jane.smith@company.com",
        contact: "+1 (555) 234-5678",
        dateEntered: "2024-02-01",
      },
      {
        id: "3",
        name: "Mike Johnson",
        avatar: "/avatars/phoenix.jpg",
        role: "Maintenance Technician",
        email: "mike.johnson@company.com",
        contact: "+1 (555) 345-6789",
        dateEntered: "2024-02-15",
      },
      {
        id: "4",
        name: "Sarah Wilson",
        avatar: "/avatars/lana.jpg",
        role: "Equipment Specialist",
        email: "sarah.wilson@company.com",
        contact: "+1 (555) 456-7890",
        dateEntered: "2024-03-01",
      },
    ],
  },
  {
    id: "2",
    name: "Operations Team",
    memberCount: 4,
    lastActivity: "Mar 23",
    members: [
      {
        id: "5",
        name: "Alex Brown",
        avatar: "/avatars/phoenix.jpg",
        role: "Operations Manager",
        email: "alex.brown@company.com",
        contact: "+1 (555) 567-8901",
        dateEntered: "2024-01-10",
      },
      {
        id: "6",
        name: "Emily Davis",
        avatar: "/avatars/olivia.jpg",
        role: "Operations Analyst",
        email: "emily.davis@company.com",
        contact: "+1 (555) 678-9012",
        dateEntered: "2024-01-20",
      },
      {
        id: "7",
        name: "Chris Miller",
        avatar: "/avatars/phoenix.jpg",
        role: "Process Coordinator",
        email: "chris.miller@company.com",
        contact: "+1 (555) 789-0123",
        dateEntered: "2024-02-05",
      },
      {
        id: "8",
        name: "Lisa Garcia",
        avatar: "/avatars/lana.jpg",
        role: "Quality Control",
        email: "lisa.garcia@company.com",
        contact: "+1 (555) 890-1234",
        dateEntered: "2024-02-20",
      },
    ],
  },
  {
    id: "3",
    name: "Sanitation Team",
    memberCount: 4,
    lastActivity: "Mar 23",
    members: [
      {
        id: "9",
        name: "David Lee",
        avatar: "/avatars/phoenix.jpg",
        role: "Sanitation Supervisor",
        email: "david.lee@company.com",
        contact: "+1 (555) 901-2345",
        dateEntered: "2024-01-05",
      },
      {
        id: "10",
        name: "Anna Taylor",
        avatar: "/avatars/olivia.jpg",
        role: "Sanitation Specialist",
        email: "anna.taylor@company.com",
        contact: "+1 (555) 012-3456",
        dateEntered: "2024-01-25",
      },
      {
        id: "11",
        name: "Tom Anderson",
        avatar: "/avatars/phoenix.jpg",
        role: "Sanitation Technician",
        email: "tom.anderson@company.com",
        contact: "+1 (555) 123-4567",
        dateEntered: "2024-02-10",
      },
      {
        id: "12",
        name: "Maria Rodriguez",
        avatar: "/avatars/lana.jpg",
        role: "Sanitation Technician",
        email: "maria.rodriguez@company.com",
        contact: "+1 (555) 234-5678",
        dateEntered: "2024-02-25",
      },
    ],
  },
  {
    id: "4",
    name: "Warehouse Team",
    memberCount: 4,
    lastActivity: "Mar 23",
    members: [
      {
        id: "13",
        name: "Kevin White",
        avatar: "/avatars/phoenix.jpg",
        role: "Warehouse Manager",
        email: "kevin.white@company.com",
        contact: "+1 (555) 345-6789",
        dateEntered: "2024-01-01",
      },
      {
        id: "14",
        name: "Rachel Green",
        avatar: "/avatars/olivia.jpg",
        role: "Inventory Specialist",
        email: "rachel.green@company.com",
        contact: "+1 (555) 456-7890",
        dateEntered: "2024-01-15",
      },
      {
        id: "15",
        name: "Steve Clark",
        avatar: "/avatars/phoenix.jpg",
        role: "Logistics Coordinator",
        email: "steve.clark@company.com",
        contact: "+1 (555) 567-8901",
        dateEntered: "2024-02-01",
      },
      {
        id: "16",
        name: "Nicole Adams",
        avatar: "/avatars/lana.jpg",
        role: "Shipping Coordinator",
        email: "nicole.adams@company.com",
        contact: "+1 (555) 678-9012",
        dateEntered: "2024-02-15",
      },
    ],
  },
];

export const useTeamStore = create<TeamStore>((set) => ({
  teams: mockTeams,
  filters: initialFilters,

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: initialFilters }),

  addTeam: (team) =>
    set((state) => ({
      teams: [...state.teams, team],
    })),

  updateTeam: (id, updates) =>
    set((state) => ({
      teams: state.teams.map((team) =>
        team.id === id ? { ...team, ...updates } : team
      ),
    })),

  deleteTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((team) => team.id !== id),
    })),
}));
