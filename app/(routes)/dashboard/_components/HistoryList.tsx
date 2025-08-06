"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { motion, AnimatePresence } from "framer-motion";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);


  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (error) {
      console.error("Failed to fetch history list", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await axios.get("/api/users");
        setCredits(res.data.credits);
      } catch (err) {
        console.error("Error fetching credits", err);
      }
    };
  
    fetchCredits();
  }, []);

  return (
    <div className="mt-10">
      <AnimatePresence mode="wait">
        {loading || credits === null ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center items-center py-20"
          >
            <motion.div
              className="h-10 w-10 rounded-full border-4 border-emerald-500 border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
          </motion.div>
        ) : historyList.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-between p-7 border border-[1.5px] border-dashed rounded-2xl bg-white shadow-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Image
                alt="empty-list"
                src={"/medical-assistance2.png"}
                width={150}
                height={150}
                priority
              />
            </motion.div>

            <motion.h2
              className="font-bold text-xl mt-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              No Recent Consultations
            </motion.h2>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              It looks like you haven't consulted with any doctors yet!
            </motion.p>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.6,
                type: "spring",
                stiffness: 200,
                damping: 12,
              }}
            >
              <AddNewSessionDialog  userCredits={credits}
                trigger={
                  <Button className="mt-3">
                    <PlusIcon className="mr-1" /> Start Consultation
                  </Button>
                }
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HistoryTable historyList={historyList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HistoryList;
