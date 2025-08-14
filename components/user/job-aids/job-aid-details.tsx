"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, X, Upload, Download, Plus } from "lucide-react"
import { useJobAidStore } from "@/store/job-aid-store"
import type { JobAid } from "@/types/job-aid"
import Link from "next/link"
import Image from "next/image"

interface JobAidDetailsProps {
  jobAidId: string
}

export function JobAidDetails({ jobAidId }: JobAidDetailsProps) {
  const { getJobAidById } = useJobAidStore()
  const [jobAid, setJobAid] = useState<JobAid | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const aid = getJobAidById(jobAidId)
    setJobAid(aid || null)
  }, [jobAidId, getJobAidById])

  if (!jobAid) {
    return <div className="p-6 text-center text-gray-600">Job aid not found.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/job-aids" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">Job Aids</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button className="bg-slate-700 hover:bg-slate-800">Share</Button>
            <Link href="/job-aids">
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Aid Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Aid Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input value={jobAid.title} readOnly />
                </div>

                {/* Category, Author, Date Created */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select value={jobAid.category} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={jobAid.category}>{jobAid.category}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <Input value={jobAid.author} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Created <span className="text-red-500">*</span>
                    </label>
                    <Input value={jobAid.dateCreated} readOnly />
                  </div>
                </div>

                {/* Safety Precautions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium">Safety Precautions</h3>
                      <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {jobAid.safetyPrecautions.length > 0 ? (
                    <ul className="space-y-2">
                      {jobAid.safetyPrecautions.map((precaution, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No safety steps added. Protect your team by adding essential precautions
                    </p>
                  )}
                </div>

                {/* Job Aid Procedures */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Job Aid Procedures</h3>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Build visual step-by-step instructions. Add a new step or [import pdf]
                  </p>

                  <div className="space-y-4">
                    {jobAid.procedures.map((procedure) => (
                      <div key={procedure.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{procedure.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-green-600">
                              {procedure.steps.length} Steps
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add New Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Button variant="outline" className="h-20 border-dashed bg-transparent">
                      <div className="text-center">
                        <Plus className="w-6 h-6 mx-auto mb-2" />
                        <span>New Instruction</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-20 border-dashed bg-transparent">
                      <div className="text-center">
                        <Plus className="w-6 h-6 mx-auto mb-2" />
                        <span>New Steps</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Assigned Equipment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned equipment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Equipment Name and Image */}
                <div>
                  <h3 className="text-lg font-medium mb-4">{jobAid.assignedEquipment.name}</h3>
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={jobAid.assignedEquipment.image || "/placeholder.svg"}
                      alt={jobAid.assignedEquipment.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Equipment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment type</label>
                  <Select value={jobAid.assignedEquipment.type} disabled>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={jobAid.assignedEquipment.type}>{jobAid.assignedEquipment.type}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input value={jobAid.assignedEquipment.location} readOnly />
                </div>

                {/* View Equipment Button */}
                <Button variant="outline" className="w-full bg-transparent">
                  View equipment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
