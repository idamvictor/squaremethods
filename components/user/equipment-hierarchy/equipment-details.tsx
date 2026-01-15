"use client";

import { Download } from "lucide-react";
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

import { useEquipmentDetails } from "@/services/equipment/equipment-queries";
import { Loader2 } from "lucide-react";

interface EquipmentDetailsProps {
  node: HierarchyNode;
}

export function EquipmentDetails({ node }: EquipmentDetailsProps) {
  const {
    data: equipmentData,
    isLoading,
    error,
  } = useEquipmentDetails(node.type !== "location" ? node.id : undefined);

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

  return (
    <div className="space-y-6">
      <Tabs defaultValue="equipment-details" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="equipment-details" className="text-blue-600">
            Equipment details
          </TabsTrigger>
          <TabsTrigger value="job-aids">Attached Job Aids</TabsTrigger>
          <TabsTrigger value="tasks">Attached Tasks</TabsTrigger>
          <TabsTrigger value="failure-mode">Failure Mode</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
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
                  {equipment.qrcode ? (
                    <Image
                      src={equipment.qrcode}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-800 text-white hover:bg-blue-700"
                  disabled={!equipment.qrcode}
                  onClick={() =>
                    equipment.qrcode && window.open(equipment.qrcode, "_blank")
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR (PNG)
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
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
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
                    <p className="text-sm text-foreground">
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
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
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
          {equipment.documents && equipment.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {equipment.documents.map((document, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col items-center justify-center text-center"
                >
                  <div className="mb-4">
                    <svg
                      className="w-12 h-12 text-blue-600 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8 16.5a1 1 0 11-2 0 1 1 0 012 0zM15 7H4a1 1 0 000 2h11a1 1 0 100-2zM4 5h7a1 1 0 000-2H4a1 1 0 000 2zm12 6H4a1 1 0 000 2h12a1 1 0 100-2z" />
                    </svg>
                  </div>
                  <a
                    href={document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm break-all underline"
                  >
                    Document {index + 1}
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => window.open(document, "_blank")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p>No documents attached to this equipment.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
