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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-white mt-8 text-center max-w-lg">
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
          <p className="text-white/80">{slides[activeIndex].description}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
