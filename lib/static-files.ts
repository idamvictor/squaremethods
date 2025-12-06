export interface FileItem {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  size?: number;
}

export const STATIC_FILES: FileItem[] = [
  {
    id: "1",
    name: "Mountain Landscape",
    url: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    size: 2048,
  },
  {
    id: "2",
    name: "Ocean Sunset",
    url: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    size: 1856,
  },
  {
    id: "3",
    name: "Forest Path",
    url: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    size: 2156,
  },
  {
    id: "4",
    name: "Urban Architecture",
    url: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    size: 1920,
  },
  {
    id: "5",
    name: "Desert Dunes",
    url: "/placeholder.svg?height=200&width=200",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    size: 2300,
  },
];
