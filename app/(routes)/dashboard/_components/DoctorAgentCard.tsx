"use client";

import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { motion } from "framer-motion";
import { toast } from "sonner";

export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?: string;
  subscriptionRequired: boolean;
};

type props = {
  doctorAgent: doctorAgent;
  credits: number | null;
};

const DoctorAgentCard = ({ doctorAgent, credits }: props) => {
  // const paidUser = has && has({ plan: "pro" });
  // console.log(paidUser);

  const [isPro, setIsPro] = useState<boolean | null>(null); // null = loading
  const [loading, setLoading] = useState(false);
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  // const [credits, setCredits] = useState<number | null>(null);

  const router = useRouter();
  const { has } = useAuth();

  const paidUser = has && has({ plan: "pro" });

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    setIsHistoryLoading(true);
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (error) {
      console.error("Failed to fetch history list", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchCredits = async () => {
  //     try {
  //       const res = await axios.get("/api/users");
  //       setCredits(res.data.credits);
  //     } catch (err) {
  //       console.error("Error fetching credits", err);
  //     }
  //   };

  //   fetchCredits();
  // }, []);

  useEffect(() => {
    if (has) {
      const result = has({ plan: "pro" });
      setIsPro(result);
    }
  }, [has]);

  const isLocked = doctorAgent.subscriptionRequired && isPro === false;

  const onStartConsultation = async () => {
    // if (!paidUser && historyList?.length >= 5) {
    //   // toast.warning("Free limit reached. Please upgrade to Pro to continue.");
    //   toast.warning("You have 0 credits left. Please upgrade to continue.", {
    //     style: {
    //       background: "#dc2626", // Tailwind red-600
    //       color: "white",
    //     },
    //   });
    //   return;
    // }

    if (credits !== null && credits <= 0) {
      toast.warning("You have 0 credits left. Please upgrade to continue.", {
        style: {
          background: "#dc2626", // Tailwind red-600
          color: "white",
        },
      });
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: `Consultation started with ${doctorAgent?.specialist}`,
        selectedDoctor: doctorAgent,
      });

      if (result.data?.sessionId) {
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      }
    } catch (error) {
      toast.error("Failed to start consultation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ⛔ Avoid rendering until isPro is resolved
  if (isPro === null || isHistoryLoading) {
    return null;
  }

  const cardEnter: // @ts-ignore
  Variants = {
    initial: {
      opacity: 0,
      y: 60,
      scale: 0.9,
      // @ts-ignore
      filter: "blur(6px)",
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      // @ts-ignore
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      y: 30,
      scale: 0.95,
      // @ts-ignore
      filter: "blur(4px)",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // function showPenguinToast({
  //   variant = "info", // info | success | warning | danger | message
  //   title = "",
  //   message = "",
  //   sender = null, // Only used for 'message' variant
  // }) {
  //   if (typeof window === "undefined") return;

  //   const event = new CustomEvent("notify", {
  //     detail: { variant, title, message, sender },
  //   });

  //   window.dispatchEvent(event);
  // }

  return (
    <motion.div
      variants={cardEnter}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={{
        scale: 1.015,
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
      }}
      className="relative flex flex-col items-center justify-center bg-gray-300 px-5 py-5 rounded-xl w-full h-full"
    >
      {doctorAgent?.subscriptionRequired && (
        <Badge
          variant={"secondary"}
          className="absolute text-lg m-2 px-4 top-0 right-0"
        >
          Pro
        </Badge>
      )}
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={200}
        className="w-full max-w-[180px] h-full object-cover rounded-full"
      />
      <h2 className="font-bold text-lg mt-2">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 pb-4 text-center text-gray-500 text-sm mb-3">
        {doctorAgent.description}
      </p>

      {/* <button disabled={!paidUser && doctorAgent.subscriptionRequired} className="w-full mt-2 cursor-pointer transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300  hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
        Start Consultation
      </button> */}

      {/* <button
        disabled={isDisabled}
        className={`w-full mt-2 transform rounded-lg px-6 py-2 font-medium transition-all duration-300
          ${
            isDisabled
              ? "cursor-not-allowed bg-gray-400 text-white"
              : "cursor-pointer bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          }`}
      >
        Start Consultation
      </button> */}

      {/* <AddNewSessionDialog trigger={
        <button
        disabled={isLocked}
        className={`w-full mt-2 transform rounded-lg px-6 py-2 font-medium transition-all duration-300
          ${
            isLocked
              ? "cursor-not-allowed bg-gray-400 text-white"
              : "cursor-pointer bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          }`}
      >
        Start Consultation
      </button>
      }/> */}

      {/* cursor-not-allowed bg-gray-400 text-white
        || (credits !== null && credits <= 0) */}

      <Button
        onClick={onStartConsultation}
        disabled={loading || isLocked }
        className={`w-full mt-2 transform rounded-lg px-6 py-2 font-medium transition-all duration-300
    bg-black text-white border dark:bg-black dark:text-white dark:border-gray-700
    hover:bg-emerald-700 dark:hover:bg-gray-900
    ${
      loading || isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
    }`}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>Start Consultation</>
        )}
      </Button>

      {/* Overlay if locked */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-100/70 backdrop-blur-[1px] border border-gray-300 shadow-inner rounded-xl z-20 flex flex-col items-center justify-center px-6 py-8 text-center pointer-events-auto"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-200 shadow-md mb-4">
            <Lock className="w-6 h-6 text-gray-700" />
          </div>
          <h3 className="text-base font-semibold text-gray-700 mb-1">
            Pro Access Required
          </h3>
          <p className="text-sm text-gray-500 mb-3">
            Upgrade to Pro to consult this specialist.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard/subscription")} // or your upgrade URL
            className="cursor-pointer px-4 py-1.5 rounded-md text-sm font-medium bg-black text-white hover:bg-gray-800 transition-all"
          >
            Upgrade Plan
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DoctorAgentCard;
