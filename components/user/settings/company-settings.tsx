"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCompanyProfile,
  useUpdateCompanySettings,
} from "@/services/company/company-queries";
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
  const [logoFile, setLogoFile] = useState<File | null>(null);

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

  const handleInputChange = (field: string, value: string) => {
    setCompanyInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0]);
    }
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
            <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/jpeg,image/png,image/gif,video/mp4,application/pdf"
                onChange={handleFileChange}
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer flex flex-col items-center"
              >
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
                  Choose a file or drag & drop it here.
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
                </span>
              </label>
              {logoFile && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected file: {logoFile.name}
                </div>
              )}
            </div>
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
    </div>
  );
}
