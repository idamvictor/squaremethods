import RightSection from "@/components/auth/right-section/right-section";
import { useAuthProtection } from "@/hooks/use-auth-protection";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This will automatically redirect to dashboard if user is authenticated
  useAuthProtection();
  return (
    <div className="flex min-h-screen bg-accent">
      <div className="flex-1/2 ">{children}</div>
      <div className="flex-1/2"><RightSection /></div>
    </div>
  );
}