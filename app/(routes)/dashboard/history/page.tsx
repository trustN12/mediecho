"use client";

import React from "react";
import HistoryList from "../_components/HistoryList";
import { motion } from "framer-motion";

const History = () => {
  return (
    <div className="min-h-screen px-6 md:px-20 lg:px-32 py-10 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-black dark:via-slate-900 dark:to-slate-950 transition-colors duration-500 rounded-xl">
      
      {/* Animated Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl md:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 text-center mb-2"
      >
        Medical Consultation History
      </motion.h2>

      {/* Subheading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto"
      >
        View and access your past consultations and AI-generated medical reports.
      </motion.p>

      {/* List Container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
       
      >
        <HistoryList />
      </motion.div>
    </div>
  );
};

export default History;
