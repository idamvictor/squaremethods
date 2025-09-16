"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export const useAuthProtection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    setIsValidating(true);
    
    // If on a public route and authenticated, redirect to dashboard
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      router.replace("/dashboard");
      return;
    }

    // If on a private route and not authenticated, redirect to login
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.replace("/auth/login");
      return;
    }

    setIsValidating(false);
  }, [isAuthenticated, pathname, router]);

  // Return both authentication state and validation state
  return { isAuthenticated, isValidating };
};
