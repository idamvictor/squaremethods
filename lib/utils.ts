import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      duration: 3000,
      className: "bg-background border-border",
    });
  },
  error: (message: string) => {
    toast.error(message, {
      duration: 4000,
      className: "bg-background border-border",
    });
  },
  warning: (message: string) => {
    toast.warning(message, {
      duration: 4000,
      className: "bg-background border-border",
    });
  },
  info: (message: string) => {
    toast.info(message, {
      duration: 3000,
      className: "bg-background border-border",
    });
  },
  loading: (message: string) => {
    return toast.loading(message, {
      className: "bg-background border-border",
    });
  },
};
