"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Image from "next/image";
import {
  JobAidProcedure,
  Precaution,
  ProcedurePrecaution,
} from "@/services/job-aid/job-aid-types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

interface StepCarouselViewProps {
  title: string;
  jobAidTitle: string;
  steps: JobAidProcedure[] | Precaution[];
  type: "procedure" | "precaution";
  initialIndex?: number;
  onBack: () => void;
}

export function StepCarouselView({
  title,
  jobAidTitle,
  steps,
  type,
  initialIndex = 0,
  onBack,
}: StepCarouselViewProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  console.log("current step index:", current);
  const [count, setCount] = useState(0);

  // Sort and parse steps
  const sortedSteps = useMemo(() => {
    return [...steps]
      .sort((a, b) => (a.step || 0) - (b.step || 0))
      .map((step) => {
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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);

    const onSelect = () => {
      const slideNodes = api.slideNodes();
      let selectedIndex = 0;

      slideNodes.forEach((node, index) => {
        if (node.classList.contains("embla__slide--selected")) {
          selectedIndex = index;
        }
      });

      setCurrent(selectedIndex);
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (api && initialIndex !== undefined) {
      api.scrollTo(initialIndex);
    }
  }, [api, initialIndex]);

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
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {jobAidTitle}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-5xl mx-auto">
        <Carousel setApi={setApi} className="w-full relative">
          <CarouselContent>
            {sortedSteps.map((step) => (
              <CarouselItem key={step.id}>
                <div className="space-y-6">
                  {/* Image */}
                  <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100 border">
                    {step.image ? (
                      <Image
                        src={step.image}
                        alt={`Step ${step.step}`}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image available
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="bg-white rounded-lg border p-6 space-y-4">
                    <div>
                      <span className="text-sm font-semibold text-gray-600">
                        Step {step.step} of{" "}
                        {sortedSteps[count - 1]?.step || count}
                      </span>
                      {step.title && (
                        <h2 className="text-2xl font-semibold text-gray-900 mt-2">
                          {step.title}
                        </h2>
                      )}
                    </div>

                    {/* Instruction - Always show this */}
                    <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {step.instruction}
                    </div>

                    {/* Precautions Section */}
                    {type === "procedure" &&
                      "precautions" in step &&
                      step.precautions &&
                      step.precautions.length > 0 && (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                          <div className="flex items-start gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-amber-900">
                                ⚠ Precautions
                              </p>
                            </div>
                          </div>
                          <ul className="space-y-2 ml-7">
                            {step.precautions.map((precaution, precIdx) => (
                              <li
                                key={precIdx}
                                className="text-sm text-amber-900 flex items-start gap-2"
                              >
                                <span className="flex-shrink-0 mt-0.5">•</span>
                                <span>{precaution.instruction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-center gap-8 mt-8">
                    {/* Step Indicator */}
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-32 bg-gray-300 rounded-full">
                        <div
                          className="h-1 bg-gray-400 rounded-full transition-all"
                          style={{
                            width: `${
                              count > 0
                                ? (step.step /
                                    (sortedSteps[count - 1]?.step || count)) *
                                  100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {count > 0
                          ? `${step.step} / ${sortedSteps[count - 1]?.step || count}`
                          : "0 / 0"}
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 hover:bg-gray-200 h-10 w-10" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 hover:bg-gray-200 h-10 w-10" />
        </Carousel>
      </div>
    </div>
  );
}
