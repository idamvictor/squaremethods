import DottedBackground from "./dotted-background";
import NavigationDots from "./navigation-dots";
import WelcomeSection from "./welcome-section";
import Image from "next/image";

export default function RightSection() {
  return (
    <main className="relative min-h-screen w-full bg-[#1e3a8a] overflow-hidden">
      <DottedBackground />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
          <Image
            src="https://res.cloudinary.com/dyp8gtllq/image/upload/v1749724753/Frame_2085664282_ebxzxg.png"
            alt="Dashboard Preview"
            width={600}
            height={400}
            priority
            className=""
          />
          <NavigationDots />
          <WelcomeSection />
        </div>
      </div>
    </main>
  );
}
