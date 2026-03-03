import { PublicEquipmentDetails } from "@/components/public/public-equipment-details";

export default async function PublicEquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Equipment Details
          </h1>
          <p className="mt-2 text-gray-600">
            View detailed information about this equipment
          </p>
        </div>

        {/* Equipment Details Component */}
        <PublicEquipmentDetails equipmentId={id} />
      </div>
    </div>
  );
}
