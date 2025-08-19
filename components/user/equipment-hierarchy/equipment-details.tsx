"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
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

interface EquipmentDetailsProps {
  node: HierarchyNode;
}

const getEquipmentColor = (type: string) => {
  const colors = {
    pump: "text-blue-600",
    assembly: "text-orange-600",
    conveyor: "text-green-600",
    motor: "text-purple-600",
    valve: "text-red-600",
    sensor: "text-yellow-600",
  };
  return colors[type as keyof typeof colors] || "text-gray-600";
};

export function EquipmentDetails({ node }: EquipmentDetailsProps) {
  if (node.type === "location") {
    return (
      <div className="text-center text-gray-500 mt-20">
        <h2 className="text-xl font-semibold mb-2">{node.name}</h2>
        <p>This is a functional location. Select equipment to view details.</p>
      </div>
    );
  }

  const equipmentTypes = [
    { value: "assembly", label: "Assembly", icon: "⚙️" },
    { value: "pump", label: "Pump", icon: "🔧" },
    { value: "conveyor", label: "Conveyor", icon: "📦" },
    { value: "motor", label: "Motor", icon: "⚡" },
    { value: "valve", label: "Valve", icon: "🔩" },
    { value: "sensor", label: "Sensor", icon: "📡" },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="equipment-details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipment-details" className="text-blue-600">
            Equipment details
          </TabsTrigger>
          <TabsTrigger value="job-aids">Attached Job Aids</TabsTrigger>
          <TabsTrigger value="tasks">Attached Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment-details" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                {node.image ? (
                  <Image
                    src={node.image}
                    alt={node.name}
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
            </div>

            {/* Middle Column - Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipment-type">Equipment type</Label>
                  <Select value={node.type} disabled>
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-lg",
                              getEquipmentColor(node.type)
                            )}
                          >
                            {
                              equipmentTypes.find((t) => t.value === node.type)
                                ?.icon
                            }
                          </span>
                          <span>
                            {
                              equipmentTypes.find((t) => t.value === node.type)
                                ?.label
                            }
                          </span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-lg",
                                getEquipmentColor(type.value)
                              )}
                            >
                              {type.icon}
                            </span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="equipment-name">
                    Equipment name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="equipment-name" value={node.name} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference-code">
                    Reference code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="reference-code"
                    value={node.referenceCode || ""}
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
                    value={node.date || ""}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={node.notes || ""}
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

            {/* Right Column - QR Code */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="w-32 h-32 mx-auto mb-4">
                  {node.qrCode ? (
                    <Image
                      src={node.qrCode}
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
                  disabled={!node.qrCode}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR (PNG)
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="job-aids" className="space-y-4">
          <div className="text-center text-gray-500 py-12">
            <p>No job aids attached to this equipment.</p>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="text-center text-gray-500 py-12">
            <p>No tasks attached to this equipment.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
