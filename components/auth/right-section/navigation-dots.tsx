"use client";

import { useState, useEffect } from "react";

export default function NavigationDots() {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalDots = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalDots);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
