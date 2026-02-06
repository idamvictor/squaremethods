"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, AlertCircle } from "lucide-react";
import Image from "next/image";
import {
  JobAidProcedure,
  Precaution,
  ProcedurePrecaution,
} from "@/services/job-aid/job-aid-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StepCarouselView } from "./step-carousel-view";

interface StepsGridViewProps {
  title: string;
  jobAidTitle: string;
  steps: JobAidProcedure[] | Precaution[];
  type: "procedure" | "precaution";
  onBack: () => void;
  onAddNew: () => void;
}

export function StepsGridView({
  title,
  jobAidTitle,
  steps,
  type,
  onBack,
  onAddNew,
}: StepsGridViewProps) {
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  // Parse precautions if they're stringified
  const parsedSteps = useMemo(() => {
    return steps.map((step) => {
      if (type === "procedure" && "precautions" in step && step.precautions) {
        const parsedPrecautions = step.precautions.map((prec) => {
          if (typeof prec === "string") {
            try {
              return JSON.parse(prec) as ProcedurePrecaution;
            } catch (e) {
              console.error("Failed to parse precaution:", prec, e);
              return { id: "", instruction: "" };
            }
          }
          return prec as ProcedurePrecaution;
        });
        return { ...step, precautions: parsedPrecautions };
      }
      return step;
    });
  }, [steps, type]);

  const handleStepClick = (index: number) => {
    setSelectedStepIndex(index);
    setShowCarousel(true);
  };

  if (showCarousel) {
    return (
      <StepCarouselView
        title={title}
        jobAidTitle={jobAidTitle}
        steps={parsedSteps as JobAidProcedure[] | Precaution[]}
        type={type}
        initialIndex={selectedStepIndex}
        onBack={() => setShowCarousel(false)}
      />
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 hover:bg-transparent"
            size="sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {jobAidTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>

          {parsedSteps && parsedSteps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsedSteps
                .sort((a, b) => (a.step || 0) - (b.step || 0))
                .map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow text-left"
                  >
                    {/* Image Container */}
                    <div className="aspect-video relative bg-gray-100 overflow-hidden">
                      {step.image ? (
                        <Image
                          src={step.image}
                          alt={`Step ${step.step}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900">
                          Step {step.step}
                        </span>
                        {type === "procedure" &&
                          "precautions" in step &&
                          step.precautions &&
                          step.precautions.length > 0 && (
                            <Popover>
                              <PopoverTrigger
                                asChild
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors flex-shrink-0">
                                  <AlertCircle className="w-3 h-3" />
                                  {step.precautions.length}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64">
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-sm text-gray-900">
                                    Precautions ({step.precautions.length})
                                  </h4>
                                  <ul className="space-y-2">
                                    {step.precautions.map((prec, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-gray-700 flex gap-2"
                                      >
                                        <span className="flex-shrink-0 text-amber-600">
                                          •
                                        </span>
                                        <span>{prec.instruction}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                      </div>
                      {step.title && (
                        <h3 className="font-medium text-gray-900 mb-2">
                          {step.title}
                        </h3>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {step.instruction}
                      </p>
                    </div>
                  </button>
                ))}

              {/* Add New Step Button */}
              <button
                onClick={onAddNew}
                className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center h-full min-h-64"
              >
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-600">
                  Add {type === "procedure" ? "Procedure" : "Precaution"}
                </span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-6">
                No {type === "procedure" ? "procedures" : "precautions"} added
                yet.
              </p>
              <Button onClick={onAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Add{type === "procedure" ? " Procedure" : " Precaution"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
