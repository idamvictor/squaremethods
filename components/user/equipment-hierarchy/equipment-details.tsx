"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Download, Eye, Plus } from "lucide-react";
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
import type { HierarchyNode } from "@/store/equipment-store";
import { FileManagerModal } from "@/components/shared/file-manager/file-manager-modal";

import {
  useEquipmentDetails,
  useEquipmentQRCode,
  useUpdateEquipment,
  useGenerateEquipmentQRCode,
} from "@/services/equipment/equipment-queries";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EquipmentDetailsProps {
  node: HierarchyNode;
}

export function EquipmentDetails({ node }: EquipmentDetailsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isInTechnicianRoute = pathname.includes("technician");
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [isUpdatingDocument, setIsUpdatingDocument] = useState(false);
  const [isRegeneratingQR, setIsRegeneratingQR] = useState(false);
  const {
    data: equipmentData,
    isLoading,
    error,
  } = useEquipmentDetails(node.type !== "location" ? node.id : undefined);

  const equipmentId = node.type !== "location" ? node.id : undefined;
  const { data: qrCodeData } = useEquipmentQRCode(equipmentId);
  const updateEquipmentMutation = useUpdateEquipment();
  const generateQRMutation = useGenerateEquipmentQRCode();

  if (node.type === "location") {
    return (
      <div className="text-center text-gray-500 mt-20">
        <h2 className="text-xl font-semibold mb-2">{node.name}</h2>
        <p>This is a functional location. Select equipment to view details.</p>
      </div>
    );
  }

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
    if (!qrCodeData?.data?.url) {
      toast.error("QR code URL is not available");
      return;
    }

    try {
      setIsDownloading(true);
      const link = document.createElement("a");
      link.href = qrCodeData.data.url;
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

  const handleAddDocument = async (fileUrl: string) => {
    if (!equipmentId) return;

    try {
      setIsUpdatingDocument(true);
      await updateEquipmentMutation.mutateAsync({
        id: equipmentId,
        data: {
          documents: [...(equipment.documents || []), fileUrl],
        },
      });

      toast.success("Document added successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to add document");
      }
    } finally {
      setIsUpdatingDocument(false);
    }
  };

  const handleRegenerateQRCode = async () => {
    if (!equipmentId) {
      toast.error("Equipment ID is missing");
      return;
    }

    try {
      setIsRegeneratingQR(true);
      await generateQRMutation.mutateAsync(equipmentId);
      toast.success("QR Code regenerated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to regenerate QR code");
      }
    } finally {
      setIsRegeneratingQR(false);
    }
  };

  const getFileTypeIcon = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase() || "";

    const iconMap: Record<string, { icon: string; color: string }> = {
      pdf: { icon: "📄", color: "text-red-600" },
      doc: { icon: "📝", color: "text-blue-600" },
      docx: { icon: "📝", color: "text-blue-600" },
      xls: { icon: "📊", color: "text-green-600" },
      xlsx: { icon: "📊", color: "text-green-600" },
      ppt: { icon: "🎯", color: "text-orange-600" },
      pptx: { icon: "🎯", color: "text-orange-600" },
      txt: { icon: "📋", color: "text-gray-600" },
      jpg: { icon: "🖼️", color: "text-purple-600" },
      jpeg: { icon: "🖼️", color: "text-purple-600" },
      png: { icon: "🖼️", color: "text-purple-600" },
      gif: { icon: "🖼️", color: "text-purple-600" },
      zip: { icon: "📦", color: "text-yellow-600" },
      rar: { icon: "📦", color: "text-yellow-600" },
    };

    return iconMap[extension] || { icon: "📎", color: "text-gray-600" };
  };

  const extractFileName = (url: string) => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split("/").pop() || "Document";
      return decodeURIComponent(filename);
    } catch {
      return url.split("/").pop() || "Document";
    }
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
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">
            Attached Tasks
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
                        alt="Upload"
                        className="mx-auto mb-4"
                        width={48}
                        height={48}
                      />
                      <p className="text-sm text-gray-500">
                        Drop your equipment image here, or click to upload
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
                {node.qrCode && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-700 text-sm">
                      QR Code generated successfully
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Right Column: QR Code */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="w-32 h-32 mx-auto mb-4">
                  {qrCodeData?.data?.url ? (
                    <Image
                      src={qrCodeData.data.url}
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
                {!qrCodeData?.data?.url ? (
                  <Button
                    onClick={handleRegenerateQRCode}
                    disabled={isRegeneratingQR}
                    className="w-full bg-orange-600 text-white hover:bg-orange-700 mb-2"
                    size="sm"
                  >
                    {isRegeneratingQR
                      ? "Regenerating..."
                      : "Regenerate QR Code"}
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-800 text-white hover:bg-blue-700 w-full"
                  disabled={!qrCodeData?.data?.url || isDownloading}
                  onClick={handleDownloadQRCode}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? "Downloading..." : "Download QR (PNG)"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="job-aids" className="space-y-4">
          {equipment.jobAids && equipment.jobAids.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {equipment.jobAids.map((jobAid) => (
                <div
                  key={jobAid.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    router.push(
                      isInTechnicianRoute
                        ? `/technician/job-aids/${jobAid.id}`
                        : `/job-aids/${jobAid.id}`,
                    )
                  }
                >
                  {jobAid.image && (
                    <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={jobAid.image}
                        alt={jobAid.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">
                        {jobAid.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          jobAid.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {jobAid.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {jobAid.category}
                    </p>
                    <p className="text-sm text-foreground line-clamp-2">
                      {jobAid.instruction}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                      <span>Duration: {jobAid.estimated_duration} mins</span>
                      <span>Views: {jobAid.view_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>No job aids attached to this equipment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="text-center text-gray-500 py-12">
            <p>No tasks attached to this equipment.</p>
          </div>
        </TabsContent>

        <TabsContent value="failure-mode" className="space-y-4">
          {equipment.failureModes && equipment.failureModes.length > 0 ? (
            <div className="space-y-4 mt-4">
              {equipment.failureModes.map((failureMode) => (
                <div
                  key={failureMode.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    router.push(
                      isInTechnicianRoute
                        ? `/technician/failure-mode/${failureMode.id}`
                        : `/failure-mode/${failureMode.id}`,
                    )
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Left: Image */}
                    {failureMode.image && (
                      <div className="relative w-full h-40 rounded-lg overflow-hidden">
                        <Image
                          src={failureMode.image}
                          alt={failureMode.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    {/* Middle: Details */}
                    <div
                      className={
                        failureMode.image ? "md:col-span-1" : "md:col-span-2"
                      }
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-foreground">
                            {failureMode.title}
                          </h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              failureMode.status === "open"
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {failureMode.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Reported by: {failureMode.reporter.first_name}{" "}
                          {failureMode.reporter.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due:{" "}
                          {new Date(failureMode.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Right: Resolutions */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-foreground">
                        Resolutions
                      </h4>
                      <ul className="space-y-1">
                        {failureMode.resolutions.map((resolution, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-muted-foreground list-disc list-inside"
                          >
                            {resolution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>No failure modes defined for this equipment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.documents &&
              equipment.documents.map((document, index) => {
                const fileType = getFileTypeIcon(document);
                const fileName = extractFileName(document);

                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 text-4xl">{fileType.icon}</div>
                    <a
                      href={document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm break-all underline mb-3"
                    >
                      {fileName}
                    </a>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(document, "_blank")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                );
              })}

            {/* Add Document Card */}
            <button
              onClick={() => setFileManagerOpen(true)}
              disabled={isUpdatingDocument}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="mb-4">
                <Plus className="h-12 w-12 text-gray-400" />
              </div>
              <span className="text-gray-600 font-semibold text-sm">
                Add Document
              </span>
            </button>
          </div>

          {(!equipment.documents || equipment.documents.length === 0) && (
            <div className="text-center text-gray-500 py-8">
              <p>
                No documents attached yet. Click the &quot;Add Document&quot;
                card above to upload one.
              </p>
            </div>
          )}

          <FileManagerModal
            open={fileManagerOpen}
            onOpenChange={setFileManagerOpen}
            onFileSelect={handleAddDocument}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
