import { create } from "zustand";
import { JobAid } from "@/services/job-aid/job-aid-types";

type AnnotationType = "procedure" | "precaution" | null;

interface JobAidStore {
  currentJobAid: JobAid | null;
  annotationType: AnnotationType;
  setCurrentJobAid: (jobAid: JobAid) => void;
  setAnnotationType: (type: AnnotationType) => void;
  clearCurrentJobAid: () => void;
}

export const useJobAidStore = create<JobAidStore>((set) => ({
  currentJobAid: null,
  annotationType: null,
  setCurrentJobAid: (jobAid: JobAid) => set({ currentJobAid: jobAid }),
  setAnnotationType: (type: AnnotationType) => set({ annotationType: type }),
  clearCurrentJobAid: () => set({ currentJobAid: null, annotationType: null }),
}));
