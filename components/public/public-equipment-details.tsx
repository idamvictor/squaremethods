"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Download, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePublicEquipmentDetails } from "@/services/public-data/public-data-queries";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PublicEquipmentDetailsProps {
  equipmentId: string;
}

export function PublicEquipmentDetails({
  equipmentId,
}: PublicEquipmentDetailsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    data: equipmentData,
    isLoading,
    error,
  } = usePublicEquipmentDetails(equipmentId);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsAuthenticated(!!token);
  }, []);

  // Determine the equipment hierarchy route based on current path
  const getEquipmentHierarchyRoute = () => {
    if (pathname.includes("technician")) {
      return "/technician/equipment-hierarchy";
    }
    return "/equipment-hierarchy";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-20">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>Failed to load equipment details.</p>
      </div>
    );
  }

  if (!equipmentData?.data) {
    return (
      <div className="text-center text-gray-500 mt-20">
        <h2 className="text-xl font-semibold mb-2">No Data</h2>
        <p>Equipment details not found.</p>
      </div>
    );
  }

  const equipment = equipmentData.data;

  const handleDownloadQRCode = async () => {
    if (!equipment.qrcode) {
      toast.error("QR code is not available");
      return;
    }

    try {
      setIsDownloading(true);
      const qrCodeUrl = equipment.qrcode.startsWith("http")
        ? equipment.qrcode
        : `https://api.squaremethods.com/${equipment.qrcode}`;
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `${equipment.name || "equipment"}-qr-code.png`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR code downloaded successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to download QR code");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to get full QR code URL
  const getQRCodeUrl = (qrcode: string | null) => {
    if (!qrcode) return null;
    if (qrcode.startsWith("http")) return qrcode;
    return `https://api.squaremethods.com/${qrcode}`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="equipment-details" className="w-full">
        <TabsList className="w-full flex flex-wrap">
          <TabsTrigger
            value="equipment-details"
            className="text-blue-600 text-xs sm:text-sm"
          >
            Equipment details
          </TabsTrigger>
          <TabsTrigger value="job-aids" className="text-xs sm:text-sm">
            Attached Job Aids
          </TabsTrigger>
          <TabsTrigger value="failure-mode" className="text-xs sm:text-sm">
            Failure Mode
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-xs sm:text-sm">
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="equipment-details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Left Column: Image on top, Form below */}
            <div className="flex flex-col gap-6">
              {/* Image */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                {equipment.image ? (
                  <Image
                    src={equipment.image}
                    alt={equipment.name}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-48 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Image
                        src="/placeholder.svg"
                        alt="Equipment"
                        className="mx-auto mb-4"
                        width={48}
                        height={48}
                      />
                      <p className="text-sm text-gray-500">
                        No image available
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="equipment-type">Type</Label>
                    <Select value={equipment.equipmentType.id} disabled>
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-blue-600">
                              {equipment.equipmentType.icon || "⚙️"}
                            </span>
                            <span>{equipment.equipmentType.name}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={equipment.equipmentType.id}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-blue-600">
                              {equipment.equipmentType.icon || "⚙️"}
                            </span>
                            <span>{equipment.equipmentType.name}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="equipment-name">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="equipment-name"
                      value={equipment.name}
                      readOnly
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="reference-code">
                      Reference code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="reference-code"
                      value={equipment.reference_code || ""}
                      readOnly
                      placeholder="54635bd"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={equipment.created_at?.split("T")[0] || ""}
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={equipment.notes || ""}
                    readOnly
                    rows={4}
                    placeholder="Please Enter"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={equipment.location.name}
                    readOnly
                  />
                </div>
              </div>
            </div>
            {/* Right Column: QR Code */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 text-center">
                <h3 className="font-semibold mb-4">QR Code</h3>
                <div className="w-32 h-32 mx-auto mb-4">
                  {getQRCodeUrl(equipment.qrcode) ? (
                    <Image
                      src={getQRCodeUrl(equipment.qrcode)!}
                      alt="QR Code"
                      width={128}
                      height={128}
                      className="w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center">
                      <div className="grid grid-cols-4 gap-1 p-2">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-white rounded-sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {getQRCodeUrl(equipment.qrcode) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-800 text-white hover:bg-blue-700 w-full"
                    disabled={isDownloading}
                    onClick={handleDownloadQRCode}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? "Downloading..." : "Download QR (PNG)"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="job-aids" className="space-y-4">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view job aids
              </p>
              <Button
                onClick={() => router.push("/auth/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                View Full Details
              </h3>
              <p className="text-gray-600 mb-6">
                Go to the equipment hierarchy to view all job aids and details
              </p>
              <Button
                onClick={() => router.push(getEquipmentHierarchyRoute())}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Equipment Hierarchy
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="failure-mode" className="space-y-4">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view failure modes
              </p>
              <Button
                onClick={() => router.push("/auth/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                View Full Details
              </h3>
              <p className="text-gray-600 mb-6">
                Go to the equipment hierarchy to view all failure modes and
                details
              </p>
              <Button
                onClick={() => router.push(getEquipmentHierarchyRoute())}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Equipment Hierarchy
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          {!isAuthenticated ? (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">
                You need to be logged in to view documents
              </p>
              <Button
                onClick={() => router.push("/auth/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Login
              </Button>
            </div>
          ) : (
            <div className="text-center py-12">
              <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                View Full Details
              </h3>
              <p className="text-gray-600 mb-6">
                Go to the equipment hierarchy to view all documents and details
              </p>
              <Button
                onClick={() => router.push(getEquipmentHierarchyRoute())}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Equipment Hierarchy
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
