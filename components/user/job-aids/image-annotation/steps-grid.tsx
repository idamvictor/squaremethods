"use client";

import { Edit, Trash2 } from "lucide-react";

interface Step {
  imageUrl: string;
  description: string;
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
              <div className="text-center">
                <span className="text-sm font-semibold text-gray-900">
                  Step {index + 1}
                </span>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <img
                src={step.imageUrl}
                alt={`Step ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
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
