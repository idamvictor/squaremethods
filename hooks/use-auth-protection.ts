"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export const useAuthProtection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, token } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const storedToken = localStorage.getItem("auth_token");

        // Handle public routes
        if (publicRoutes.includes(pathname)) {
          if (isAuthenticated && token) {
            router.replace("/dashboard");
          }
          setIsValidating(false);
          return;
        }

        // Handle protected routes
        if (!isAuthenticated || !storedToken) {
          router.replace("/auth/login");
          return;
        }

        setIsValidating(false);
      } catch (error) {
        console.error("Auth validation error:", error);
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [isAuthenticated, pathname, router, token]);

  return {
    isAuthenticated,
    isValidating,
    isPublicRoute: publicRoutes.includes(pathname),
  };
};
