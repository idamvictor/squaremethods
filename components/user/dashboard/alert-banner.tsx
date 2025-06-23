import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";

export function AlertBanner() {
  return (
    <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Info className="w-5 h-5" />
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Insert your alert title here!</span>
          <span>•</span>
          <span>Insert your description here.</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-auto p-1 ml-2"
          >
            Upgrade
            <span className="ml-1">{">"}</span>
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20 h-auto p-1"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
