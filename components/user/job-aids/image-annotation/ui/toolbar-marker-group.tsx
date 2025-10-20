"use client";

import { useState } from "react";
import Image from "next/image";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MarkerTypeGroup, MarkerTypeItem } from "@/models/toolbar";
import ChevronDownIcon from "@/public/icons/chevron-down.svg";

type Props = {
  markers: MarkerTypeGroup;
  variant?: "ghost" | "outline";
  toggled: boolean;
  onSelectionChange: (markerType: MarkerTypeItem) => void;
};

const ToolbarMarkerGroup = ({
  markers,
  variant = "ghost",
  toggled,
  onSelectionChange,
}: Props) => {
  const [currentMarkerType, setCurrentMarkerType] = useState(
    markers.markerTypes[0]
  );

  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleMarkerSelection = (markerType: MarkerTypeItem) => {
    setCurrentMarkerType(markerType);
    setPopoverOpen(false);
    onSelectionChange(markerType);
  };

  return (
    <div className="inline-flex border rounded-md border-transparent hover:border hover:border-slate-200">
      <Toggle
        title={currentMarkerType.name}
        pressed={toggled}
        variant={variant === "ghost" ? "default" : "outline"}
        className="rounded-r-none border-r-0"
        onClick={() => handleMarkerSelection(currentMarkerType)}
      >
        <Image
          src={currentMarkerType.icon}
          alt={currentMarkerType.name}
          width={20}
          height={20}
          className="opacity-70"
        />
      </Toggle>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            title={markers.name}
            size="icon"
            className="rounded-l-none border-l-0 bg-transparent px-2"
            onClick={() => setPopoverOpen(!popoverOpen)}
          >
            <Image
              src={ChevronDownIcon}
              alt="More options"
              width={16}
              height={16}
              className="opacity-60"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-wrap w-auto p-2">
          {markers.markerTypes.map((markerType) => (
            <Button
              variant="ghost"
              size="icon"
              key={markerType.name}
              title={markerType.name}
              onClick={() => handleMarkerSelection(markerType)}
            >
              <Image
                src={markerType.icon}
                alt={markerType.name}
                width={20}
                height={20}
                className="opacity-70"
              />
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ToolbarMarkerGroup;
