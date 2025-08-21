import { Calendar } from "@/components/technician/calendar/calendar";

export default function page() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <Calendar />
      </div>
    </div>
  );
}
