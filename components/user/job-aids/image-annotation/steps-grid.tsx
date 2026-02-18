"use client";

import Image from "next/image";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { ProcedurePrecaution } from "@/services/job-aid/job-aid-types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Step {
  imageUrl: string;
  description: string;
  precautions?: ProcedurePrecaution[];
}

interface StepsGridProps {
  steps: Step[];
  onEdit?: (index: number) => void;
  onRemove?: (index: number) => void;
}

export default function StepsGrid({ steps, onEdit, onRemove }: StepsGridProps) {
  if (steps.length === 0) {
    return (
      <div className="w-full mt-6 border-t border-gray-200 pt-6">
        <div className="text-center py-12">
          <p className="text-gray-500">
            No steps yet. Add your first step above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 border-t border-gray-200 pt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden relative"
          >
            {/* Step Number Banner */}
            <div className="bg-white py-2 border-b border-gray-200">
              <div className="flex items-center justify-between px-4">
                <span className="text-sm font-semibold text-gray-900">
                  Step {index + 1}
                </span>
                {steps[index].precautions &&
                  steps[index].precautions!.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {steps[index].precautions!.length}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-gray-900">
                            Precautions ({steps[index].precautions!.length})
                          </h4>
                          <ul className="space-y-2">
                            {steps[index].precautions!.map((prec, idx) => (
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
            </div>

            {/* Image */}
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              {step.imageUrl ? (
                <Image
                  src={step.imageUrl}
                  alt={`Step ${index + 1}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-4">
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => onEdit?.(index)}
                className="text-gray-600 hover:text-gray-900 p-1"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove?.(index)}
                className="text-gray-600 hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
