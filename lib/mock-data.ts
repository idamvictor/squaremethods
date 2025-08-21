import { avatarImage } from "@/constants/images";

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  contact: string;
  dateEntered: string;
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  lastActivity: string;
  members: TeamMember[];
}

export interface TeamFilters {
  count: string;
  category: string;
}

export const mockTeams: Team[] = [
  {
    id: "maintenance-team",
    name: "Maintenance Team",
    memberCount: 12,
    lastActivity: "Mar 23",
    members: [
      {
        id: "1",
        name: "Leslie Alexander",
        avatar: avatarImage.image1,
        role: "Admin",
        email: "jeremy001@mail.com",
        contact: "07067788432",
        dateEntered: "05 / 12 / 2025",
      },
      {
        id: "2",
        name: "Floyd Miles",
        avatar: avatarImage.image2,
        role: "Super Admin",
        email: "floydmiles@mail.com",
        contact: "07067788432",
        dateEntered: "05 / 12 / 2025",
      },
      {
        id: "3",
        name: "Jerome Bell",
        avatar: avatarImage.image3,
        role: "Viewer",
        email: "lesliealx01@mail.com",
        contact: "07067788432",
        dateEntered: "05 / 12 / 2025",
      },
      {
        id: "4",
        name: "Savannah Nguyen",
        avatar: avatarImage.image4,
        role: "Editor",
        email: "lesliealx01@mail.com",
        contact: "07067788432",
        dateEntered: "05 / 12 / 2025",
      },
      {
        id: "5",
        name: "Jenny Wilson",
        avatar: avatarImage.image1,
        role: "Admin",
        email: "lesliealx01@mail.com",
        contact: "07067788432",
        dateEntered: "05 / 12 / 2025",
      },
      {
        id: "6",
        name: "Jacob Jones",
        avatar: avatarImage.image2,
        role: "Viewer",
        email: "lesliealx01@mail.com",
        contact: "07067788432",
        dateEntered: "05 / 12 / 2025",
      },
    ],
  },
  {
    id: "operations-team",
    name: "Operations Team",
    memberCount: 12,
    lastActivity: "Mar 23",
    members: [
      {
        id: "7",
        name: "Alex Brown",
        avatar: avatarImage.image3,
        role: "Admin",
        email: "alex.b@mail.com",
        contact: "07067788433",
        dateEntered: "04 / 10 / 2025",
      },
      {
        id: "8",
        name: "Emily Davis",
        avatar: avatarImage.image4,
        role: "Viewer",
        email: "emily.d@mail.com",
        contact: "07067788434",
        dateEntered: "04 / 10 / 2025",
      },
      {
        id: "9",
        name: "Chris Miller",
        avatar: avatarImage.image1,
        role: "Editor",
        email: "chris.m@mail.com",
        contact: "07067788435",
        dateEntered: "04 / 10 / 2025",
      },
    ],
  },
  {
    id: "sanitation-team",
    name: "Sanitation Team",
    memberCount: 12,
    lastActivity: "Mar 23",
    members: [
      {
        id: "10",
        name: "David Lee",
        avatar: avatarImage.image2,
        role: "Admin",
        email: "david.l@mail.com",
        contact: "07067788436",
        dateEntered: "03 / 01 / 2025",
      },
      {
        id: "11",
        name: "Anna Taylor",
        avatar: avatarImage.image3,
        role: "Viewer",
        email: "anna.t@mail.com",
        contact: "07067788437",
        dateEntered: "03 / 01 / 2025",
      },
    ],
  },
  {
    id: "warehouse-team",
    name: "Warehouse Team",
    memberCount: 12,
    lastActivity: "Mar 23",
    members: [
      {
        id: "12",
        name: "Kevin White",
        avatar: avatarImage.image1,
        role: "Admin",
        email: "kevin.w@mail.com",
        contact: "07067788438",
        dateEntered: "02 / 15 / 2025",
      },
      {
        id: "13",
        name: "Rachel Green",
        avatar: avatarImage.image1,
        role: "Editor",
        email: "rachel.g@mail.com",
        contact: "07067788439",
        dateEntered: "02 / 15 / 2025",
      },
    ],
  },
];
