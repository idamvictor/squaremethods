import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function DeleteAccount() {
  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Illustration */}
        <div className="mb-8">
          <Image
            src="https://res.cloudinary.com/dyp8gtllq/image/upload/v1750698728/Searching_debug_mistake_issue_error_gxtuuy.png"
            alt="Person with magnifying glass debugging illustration"
            width={200}
            height={150}
            className="mx-auto"
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-3 leading-tight">
          Are you sure you want to delete your account
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          By clicking on the delete button, your account is deleted permanently
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button className="flex-1 bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 px-6 rounded-lg">
            Cancel
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-white text-red-600 border-gray-300 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
