"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Plus, Edit, FileDown } from "lucide-react";

export function JobAidForm() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className=" p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">New job aid</h1>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Import
        </Button>
      </div>

      <div className="flex gap-8">
        {/* Left Sidebar - Steps */}
        <div className="w-12 flex flex-col gap-6">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer hover:opacity-80 ${
                step <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Step 1: Job Aid Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-medium text-gray-700">
                Job Aid Details
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  defaultValue="Hydraulic press engine"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700"
                  >
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select defaultValue="monthly-maintenance">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly-maintenance">
                        Monthly Maintance
                      </SelectItem>
                      <SelectItem value="weekly-maintenance">
                        Weekly Maintenance
                      </SelectItem>
                      <SelectItem value="daily-maintenance">
                        Daily Maintenance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="author"
                    className="text-sm font-medium text-gray-700"
                  >
                    Author <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="author"
                    defaultValue="Andy Miracle"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="date"
                    className="text-sm font-medium text-gray-700"
                  >
                    Date Created <span className="text-red-500">*</span>
                  </Label>
                  <Select defaultValue="12/04/2026">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12/04/2026">12/04/2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Assign to Equipment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium text-gray-700">
                  Assign to Equipment
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Select the machine or system this Job Aid applies to
                </p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-blue-600">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Equipment name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Equipment Type
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        Hydraulic press engine
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Sub Assembly
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        Manufacturing Plant
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Safety Precautions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium text-gray-700 flex items-center gap-2">
                  Safety Precautions
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  No safety steps added. Protect your team by adding essential
                  precautions
                </p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </CardHeader>
          </Card>

          {/* Step 4: Job Aid Procedures */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium text-gray-700">
                  Job Aid Procedures
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Build visual step-by-step instructions. Add a new step or
                  [Import pdf]
                </p>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-gray-500">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    Hydraulic press engine change over
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-green-700 bg-green-100"
                  >
                    11 Steps
                  </Badge>
                </div>
                <Button
                  size="sm"
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <FileDown className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    Hydraulic press engine reboot
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-green-700 bg-green-100"
                  >
                    11 Steps
                  </Badge>
                </div>
                <Button
                  size="sm"
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <FileDown className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Actions */}
          <div className="flex justify-between items-center gap-3 pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">Save as draft</Button>
              {currentStep === 4 ? (
                <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
              ) : (
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() =>
                    setCurrentStep((prev) => Math.min(4, prev + 1))
                  }
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
