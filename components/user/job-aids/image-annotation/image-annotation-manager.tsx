"use client";

import React, { useState } from "react";
import Editor from "./editor";
import { AnnotationState } from "@markerjs/markerjs3";
import sampleImage from "@/public/sample-images/phone-modules.jpg";
import StepsGrid from "./steps-grid";
import { Button } from "@/components/ui/button";

interface ImageAnnotationManagerProps {
  type: "instruction" | "step";
}

interface Step {
  instruction: string;
  imageUrl: string;
  description: string;
}

export default function ImageAnnotationManager({
  type,
}: ImageAnnotationManagerProps) {
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [demoSteps] = useState([
    {
      imageUrl: sampleImage.src,
      description:
        "Lorem ipsum dolor sit amet consectetur. Ut consequat elit eget bibendum tortor aliquam aliquam.",
    },
    {
      imageUrl: sampleImage.src,
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      imageUrl: sampleImage.src,
      description: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      imageUrl: sampleImage.src,
      description:
        "Lorem ipsum dolor sit amet consectetur. Ut consequat elit eget bibendum tortor aliquam aliquam.",
    },
    {
      imageUrl: sampleImage.src,
      description:
        "Lorem ipsum dolor sit amet consectetur. Ut consequat elit eget bibendum tortor aliquam aliquam.",
    },
    {
      imageUrl: sampleImage.src,
      description:
        "Lorem ipsum dolor sit amet consectetur. Ut consequat elit eget bibendum tortor aliquam aliquam.",
    },
  ]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        instruction: "",
        imageUrl: sampleImage.src,
        description: "",
      },
    ]);
  };

  const updateStepInstruction = (index: number, instruction: string) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      instruction,
    };
    setSteps(newSteps);
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", {
      steps,
      annotation,
    });
  };

  const handlePublish = () => {
    console.log("Publishing:", {
      steps,
      annotation,
    });
  };

  const handleEditStep = (index: number) => {
    console.log("Editing step:", index);
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {type === "instruction"
            ? "Create New Instruction"
            : "Create New Step"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Add annotations to your image to create clear visual instructions
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Image Annotation - 50% */}
          <div className="w-full lg:w-[60%] bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col gap-6 p-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Editor</h3>
                <div className="h-[600px] w-full rounded-lg border border-gray-200 overflow-hidden">
                  <Editor
                    targetImageSrc={sampleImage.src}
                    annotation={annotation}
                    onSave={(newAnnotation) => {
                      setAnnotation(newAnnotation);
                      console.log("Annotation saved:", newAnnotation);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Instructions Form - 50% */}
          <div className="w-full lg:w-[40%] bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Procedures
                </h3>
                <p className="text-sm text-gray-500">
                  Write your steps below, please stick to order
                </p>
              </div>

              <div className="space-y-4">
                {/* Steps */}
                {steps.map((step, index) => (
                  <div key={index} className="relative pl-8">
                    <div className="absolute left-0 top-2 flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Step Instruction
                      </label>
                      <textarea
                        value={step.instruction}
                        onChange={(e) =>
                          updateStepInstruction(index, e.target.value)
                        }
                        className="w-full min-h-[100px] p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Please Enter"
                      />
                    </div>
                  </div>
                ))}

                {/* Add Step Button */}
                <button
                  onClick={addStep}
                  className="w-full py-2 px-4 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                >
                  + Add Another Step
                </button>

                {/* Save Button */}
                <div className="pt-4 mt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveDraft}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Instructions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Grid showing all steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">All Steps</h3>
              <p className="text-sm text-gray-500">
                View and manage all created steps
              </p>
            </div>
          </div>

          <StepsGrid
            steps={demoSteps}
            onEdit={handleEditStep}
            onRemove={handleRemoveStep}
          />
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-8 right-8 flex items-center gap-3 z-10">
          <Button onClick={handleSaveDraft} size="lg" variant="outline">
            Save as draft
          </Button>
          <Button onClick={handlePublish} size="lg">
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
