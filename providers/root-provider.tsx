import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for Zustand store to hydrate
  useEffect(() => {
    const unsubHydration = useAuthStore.persist.onHydrate(() => {
      setIsHydrated(false);
    });

    const unsubFinishHydration = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    setIsHydrated(useAuthStore.persist.hasHydrated());

    return () => {
      unsubHydration();
      unsubFinishHydration();
    };
  }, []);

  // Show nothing until hydration is complete
  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}

export function RootProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
