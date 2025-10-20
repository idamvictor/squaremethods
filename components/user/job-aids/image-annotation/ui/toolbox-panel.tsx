"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MarkerBaseEditor } from "@markerjs/markerjs3";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  icon: string;
  variant?: "ghost" | "outline";
  children: ReactNode;
} & React.ComponentProps<"div">;

export type PanelProps = {
  markerEditor: MarkerBaseEditor;
  variant?: "ghost" | "outline";
};

const ToolboxPanel = ({
  title,
  icon,
  variant = "ghost",
  children,
  className,
  ...props
}: Props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <div className="inline-flex">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            title={title}
            onClick={() => setPopoverOpen(!popoverOpen)}
          >
            <Image
              src={icon}
              alt={title}
              width={20}
              height={20}
              className="opacity-70"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-48 w-auto p-4">
          <div className={cn("flex flex-col space-y-6", className)} {...props}>
            <h2 className="text-sm font-semibold">{title}</h2>
            {children}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ToolboxPanel;
