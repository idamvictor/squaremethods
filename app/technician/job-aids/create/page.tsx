import AddJobAidForm from "@/components/user/job-aids/add-job-aid-form";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AddJobAidForm
        onNewInstructionClick={() => {}}
        onNewStepClick={() => {}}
      />
    </div>
  );
}
