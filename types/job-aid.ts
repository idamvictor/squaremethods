export interface JobAidStep {
  id: string
  title: string
  description: string
  order: number
}

export interface JobAidProcedure {
  id: string
  title: string
  steps: JobAidStep[]
}

export interface AssignedEquipment {
  name: string
  image: string
  type: string
  location: string
}

export interface JobAid {
  id: string
  title: string
  subtitle: string
  category: string
  author: string
  dateCreated: string
  image: string
  assignedEquipment: AssignedEquipment
  safetyPrecautions: string[]
  procedures: JobAidProcedure[]
  viewCount: number
  isRecent: boolean
}

export interface JobAidFilters {
  count: string
  equipment: string
  category: string
}
