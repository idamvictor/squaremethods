import { Toaster } from "@/components/ui/sonner";
import { EquipmentHierarchy } from "@/components/user/equipment-hierarchy/equipment-hierarchy";

export default function page() {
  return (
    <main>
      <EquipmentHierarchy />
      <Toaster />
    </main>
  );
}
