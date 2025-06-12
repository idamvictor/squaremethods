"use client";

import { type Dispatch, type SetStateAction } from "react";

interface NavigationDotsProps {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}

export default function NavigationDots({
  activeIndex,
  setActiveIndex,
}: NavigationDotsProps) {
  const totalDots = 3;

  return (
    <div className="flex space-x-2 mt-4">
      {Array.from({ length: totalDots }).map((_, index) => (
        <button
          key={index}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === activeIndex ? "bg-white w-6" : "bg-white/50"
          }`}
          onClick={() => setActiveIndex(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
