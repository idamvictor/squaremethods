"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCompanyProfile,
  useUpdateCompanySettings,
} from "@/services/company/company-queries";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";
import { toast } from "sonner";

export function CompanySettings() {
  const { data: companyProfile, isLoading: isLoadingProfile } =
    useCompanyProfile();
  const updateCompanySettings = useUpdateCompanySettings();

  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    domain: "",
    address: "",
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  // Initialize form with company profile data when available
  useEffect(() => {
    if (companyProfile?.data) {
      setCompanyInfo({
        name: companyProfile.data.name,
        domain: companyProfile.data.slug,
        address: companyProfile.data.address,
      });
    }
  }, [companyProfile]);

  const handleFileSelect = (fileUrl: string) => {
    setLogoUrl(fileUrl);
  };

  const handleInputChange = (field: string, value: string) => {
    setCompanyInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateCompanySettings.mutateAsync({
        name: companyInfo.name,
        address: companyInfo.address,
      });

      toast.success("Company settings updated successfully");
    } catch (error) {
      console.error("Failed to update company settings:", error);
      toast.error("Failed to update company settings");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-medium text-gray-500 mb-6">Company</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company&apos;s name
            </label>
            <Input
              type="text"
              value={companyInfo.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Squaremethod"
              className="w-full"
              disabled={isLoadingProfile || updateCompanySettings.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company&apos;s domain
            </label>
            <Input
              type="text"
              value={companyInfo.domain}
              onChange={(e) => handleInputChange("domain", e.target.value)}
              placeholder="Squaremethod.com"
              className="w-full"
              disabled={isLoadingProfile || updateCompanySettings.isPending}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company logo
            </label>
            <button
              type="button"
              onClick={() => setIsFileManagerOpen(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            >
              {logoUrl ? (
                <div className="flex flex-col items-center">
                  <img
                    src={logoUrl}
                    alt="Company logo preview"
                    className="h-16 w-16 object-cover rounded mb-2"
                  />
                  <span className="text-sm text-gray-600">
                    Click to change logo
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <svg
                    className="w-8 h-8 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-sm text-gray-600">
                    Click to select or upload logo
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    Image formats accepted
                  </span>
                </div>
              )}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company&apos;s Address
            </label>
            <Input
              type="text"
              value={companyInfo.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Squaremethod"
              className="w-full"
              disabled={isLoadingProfile || updateCompanySettings.isPending}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="mt-6"
          disabled={isLoadingProfile || updateCompanySettings.isPending}
        >
          {updateCompanySettings.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>

      <FileManagerModal
        open={isFileManagerOpen}
        onOpenChange={setIsFileManagerOpen}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}
