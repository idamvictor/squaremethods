"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <div className=" ">
      {/* Floating Back Button */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="fixed top-20 left-2 z-50 text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-md rounded-full"
        size="sm"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Content */}
      <div className="p-4 md:p-6 max-w-6xl mx-auto pt-10">
        <Carousel setApi={setApi} className="w-full relative">
          <CarouselContent>
            {sortedSteps.map((step) => (
              <CarouselItem key={step.id}>
                <div className="space-y-6">
                  {/* Main Content - Side by Side Layout */}
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 bg-white  overflow-hidden hover:shadow-md transition-shadow md:h-[80vh]">
                    {/* Image Section - Left */}
                    <Card className="relative w-full md:w-96 h-48 md:h-96 flex-shrink-0 bg-gray-100 overflow-hidden border-0 shadow-sm">
                      {step.image &&
                      typeof step.image === "string" &&
                      (step.image.startsWith("/") ||
                        step.image.startsWith("http")) ? (
                        <Image
                          src={step.image}
                          alt={`Step ${step.step}`}
                          fill
                          className="object-contain"
                          priority
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          No image available
                        </div>
                      )}
                    </Card>

                    {/* Content Section - Right */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col md:h-full">
                      {/* Title */}
                      <div className="mb-4 md:mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
                          {jobAidTitle}
                        </h1>
                        <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          Step {step.step} of{" "}
                          {sortedSteps[count - 1]?.step || count}
                        </span>
                      </div>

                      {/* Scrollable Content Area */}
                      <div className="flex-1 overflow-y-auto space-y-4 md:space-y-5 md:pr-4">
                        {/* Instruction */}
                        <div>
                          <h3 className="text-xs md:text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                            Instructions
                          </h3>
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                            {step.instruction}
                          </p>
                        </div>

                        {/* Precautions Section */}
                        {type === "procedure" &&
                          "precautions" in step &&
                          step.precautions &&
                          step.precautions.length > 0 && (
                            <div className="p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                              <div className="flex items-start gap-2 mb-3">
                                <AlertCircle className="w-4 md:w-5 h-4 md:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs md:text-sm font-semibold text-amber-900">
                                  ⚠ Precautions
                                </p>
                              </div>
                              <ul className="space-y-2 ml-6 md:ml-7">
                                {step.precautions.map((precaution, precIdx) => (
                                  <li
                                    key={precIdx}
                                    className="text-xs md:text-sm text-amber-900 flex items-start gap-2"
                                  >
                                    <span className="flex-shrink-0 mt-0.5">
                                      •
                                    </span>
                                    <span>{precaution.instruction}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <CarouselPrevious className="absolute left-2 md:left-0 top-[100%] -translate-y-1/2 md:-translate-x-12 hover:bg-gray-200 h-9 md:h-10 w-9 md:w-10 z-10" />
          <CarouselNext className="absolute right-2 md:right-0 top-[100%] -translate-y-1/2 md:translate-x-12 hover:bg-gray-200 h-9 md:h-10 w-9 md:w-10 z-10" />
        </Carousel>
      </div>
    </div>
  );
}
