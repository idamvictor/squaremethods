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

interface EquipmentDetailsProps {
  node: HierarchyNode;
}

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                {node.image ? (
                  <Image
                    src={node.image || "/placeholder.svg"}
                    alt={node.name}
                    width={480}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image
                      src="/placeholder-sg4cf.png"
                      alt="Equipment placeholder"
                      width={480}
                      height={192}
                      className="w-full h-full object-cover rounded-lg"
                    />
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
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
                  />
                </div>

                <div>
                  <Label htmlFor="date">
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Select value={node.date || ""} disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={node.date || ""}>
                        {node.date}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={node.notes || "Please Enter"}
                  readOnly
                  rows={4}
                />
              </div>
            </div>

            {/* Right Column - QR Code */}
            <div className="space-y-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-full h-full bg-black rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 ${
                            Math.random() > 0.5 ? "bg-white" : "bg-black"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
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
