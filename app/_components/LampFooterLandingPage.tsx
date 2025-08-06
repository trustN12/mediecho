"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";
import { FlipWords } from "@/components/ui/flip-words";

export function LampFooterLandingPage() {
  const words = ["Insight", "Triage", "Consultation", "Diagnosis"];
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-5 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center font-medium tracking-tight text-transparent"
      >
        <div className="text-2xl md:text-3xl lg:text-5xl font-normal text-gray-400 z-10">
          From
          <FlipWords words={words} /> <br />
          streamline every workflow with AI
        </div>
      </motion.h1>
    </LampContainer>
  );
}
