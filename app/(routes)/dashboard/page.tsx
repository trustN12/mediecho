"use client";

import React, { useEffect, useState } from "react";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { SessionDetail } from "./medical-agent/[sessionId]/page";

const Dashboard = () => {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);

  // const { has } = useAuth();

  // const paidUser = has && has({ plan: "pro" });

  useEffect(() => {
    GetHistoryList();
  }, []);

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

  if (isHistoryLoading) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-4 text-center sm:text-left mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>
        {credits === null ? null : credits <= 0 ? (
          <Button
            className="w-full sm:w-auto text-sm bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => (window.location.href = "/dashboard/subscription")}
          >
            Upgrade to Pro
          </Button>
        ) : (
          <AddNewSessionDialog  userCredits={credits}
            trigger={
              <Button className="w-full sm:w-auto text-sm">
                <Plus className="size-4 sm:size-5" />
                Connect with a Doctor
              </Button>
            }
          />
        )}
      </div>

      <HistoryList />
      <DoctorsAgentList credits={credits}/>
    </div>
  );
};

export default Dashboard;
