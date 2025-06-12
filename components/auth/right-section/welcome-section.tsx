"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Welcome to Squaremethods",
    description:
      "We digitize frontline procedures with visual guides, SOPs, and checklists—so new hires work like experts from Day 1.",
  },
  {
    title: "Streamline Your Operations",
    description:
      "Create digital workflows that ensure consistency and quality across your entire organization.",
  },
  {
    title: "Improve Performance",
    description:
      "Track adherence and completion rates to identify areas for improvement and training opportunities.",
  },
];

export default function WelcomeSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-primary-foreground mt-8 text-left max-w-lg p-10">
      <div className="flex space-x-2 mb-4">
        {Array.from({ length: slides.length }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-primary-foreground w-6"
                : "bg-primary-foreground/50"
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            {slides[activeIndex].title}
          </h1>
          <p className="text-primary-foreground/80">
            {slides[activeIndex].description}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
