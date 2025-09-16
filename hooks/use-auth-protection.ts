import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

export const useAuthProtection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
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
  }, [isAuthenticated, pathname, router]);

  return { isAuthenticated };
};
