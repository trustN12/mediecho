"use client";

import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";



// const { has } = useAuth();
//   const paidUser = has && has({ plan: "pro" });

type AddNewSessionDialogProps = {
  trigger: ReactNode; // custom button
  userCredits: number | null;
};

const AddNewSessionDialog = ({ trigger }: AddNewSessionDialogProps) => {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const router = useRouter();

  const OnClickNext = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggest-doctors", {
      notes: note,
    });

    // console.log(result.data);
    setSuggestedDoctors(result.data);
    setLoading(false);
  };

  const onStartConsultation = async () => {
    //  Save all info to the DATABASE
    setLoading(true);

    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });
    // console.log(result.data);
    if (result.data?.sessionId) {
      // console.log(result.data.sessionId);
      // ROUTE TO NEW CONVERSATION SCREEN
      router.push("/dashboard/medical-agent/" + result.data.sessionId);
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2>Add Symptoms or any other details</h2>
                <Textarea
                  placeholder="Add Details here..."
                  className="h-[200px] mt-1"
                  onChange={(event) => setNote(event.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2 className="m-1">Select Your Doctor</h2>
                <div className="grid grid-cols-3 gap-5">
                  {/* Suggested Doctors */}
                  {suggestedDoctors.map((doctor, index) => (
                    <SuggestedDoctorCard
                      doctorAgent={doctor}
                      key={index}
                      setSelectedDoctor={() => setSelectedDoctor(doctor)}
                      // @ts-ignore
                      selectedDoctor={selectedDoctor}
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button
              disabled={!note || loading}
              className="w-auto cursor-pointer transform rounded-lg border  hover:bg-emerald-400 px-6 py-2 font-medium text-black transition-all duration-300 bg-emerald-900 text-white dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
              onClick={() => OnClickNext()}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Next <ArrowRight className="ml-1" />
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled={loading || !selectedDoctor}
              onClick={() => onStartConsultation()}
              className="cursor-pointer transform rounded-lg border bg-emerald-700 px-6 text-white py-2 font-medium transition-all duration-300  hover:bg-purple-700 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Start Consultation <ArrowRight className="ml-1" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSessionDialog;
