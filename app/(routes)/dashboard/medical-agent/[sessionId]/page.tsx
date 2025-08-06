"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Loader2, PhoneIcon, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import { Report } from "../../_components/ViewReportDialog";

export type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: Report;
  selectedDoctor: doctorAgent;
  createdOn: string;
  user: string;
};

type messages = {
  role: string;
  text: string;
};

const MedicalVoiceAgent = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callDuration, setCallDuration] = useState(0); // seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  useEffect(() => {
    GetSessionDetails();
  }, []);

  const GetSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    // console.log(result.data);
    setSessionDetail(result.data);
  };

  // START CALL

  const StartCall = () => {
    if (!sessionDetail || !sessionDetail.selectedDoctor) {
      alert("Session details not loaded yet. Please wait.");
      return;
    }

    if (
      !sessionDetail.selectedDoctor.voiceId ||
      !sessionDetail.selectedDoctor.agentPrompt
    ) {
      alert("Missing doctor voice or prompt.");
      return;
    }

    setIsLoading(true); // ✅ Start loading

    // Move inside click handler to preserve gesture context
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const VapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage: "Hi there! I'm your AI Medical Doctor Agent...",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetail.selectedDoctor.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: sessionDetail.selectedDoctor.agentPrompt,
          },
        ],
      },
    };

    // Start the call
    // @ts-ignore
    vapi.start(VapiAgentConfig);

    // vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID)

    // Register events immediately after
    vapi.on("call-start", () => {
      // console.log("Call started");
      setCallStarted(true);
      setIsLoading(false); // ✅ Stop loading

      toast.success("Successfully connected to the AI Medical Doctor.", {
        duration: 5000,
        icon: "🩺",
      });

      // Start timer
      // Start or restart the timer safely
      setCallDuration(0);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    });
    vapi.on("call-end", () => {
      // console.log("Call ended");
      setCallStarted(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => [...prev, { role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      // console.log("Assistant started speaking");
      setCurrentRole("assistant");
      setIsSpeaking(true); // ✅ Trigger animation
    });
    vapi.on("speech-end", () => {
      // console.log("Assistant stopped speaking");
      setCurrentRole("user");
      setIsSpeaking(false); // ✅ Stop animation
    });
  };

  // END CALL

  const endCall = async () => {
    if (!vapiInstance) return;

    setIsLoading(true); // Show "Disconnecting..."

    try {
      await GenerateReport();

      // 🟢 Deduct 1 credit
      try {
        await axios.patch("/api/users", { amount: -1 });
        window.dispatchEvent(new Event("creditsUpdated"));
        // console.log("✅ 1 credit deducted successfully");
      } catch (creditErr) {
        console.error("❌ Failed to deduct credit", creditErr);
        toast.error("Failed to deduct credit", {
          style: {
            background: "#dc2626", // Tailwind red-600
            color: "white",
          },
        });
      }

      // Add this BEFORE stop: attach listener for call-end
      vapiInstance.on("call-end", () => {
        // console.log("Call fully ended");
        setCallStarted(false);
        setVapiInstance(null);
        setIsLoading(false);

        toast.success("Medical Report Ready!", {
          description: "You can now download or print your report.",
          duration: 5000,
          style: {
            background: "#16a34a", // Tailwind green-600
            color: "white",
          },
        });

        router.replace("/dashboard/history");
      });

      // Stop the call (triggers "call-end" event above)
      vapiInstance.stop();

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Optional: remove listeners safely (you could delay this if needed)
      vapiInstance.off("call-start");
      vapiInstance.off("message");
      vapiInstance.off("speech-start");
      vapiInstance.off("speech-end");
    } catch (err) {
      // toast.error("Something went wrong ending the call.", {
      //   style: {
      //     background: "#dc2626", // Tailwind red-600
      //     color: "white",
      //   },
      // });
      // console.error("End call error:", err);
      setIsLoading(false);
    }
  };

  const GenerateReport = async () => {
    try {
      const result = await axios.post("/api/medical-report", {
        messages: messages,
        sessionDetail: sessionDetail,
        sessionId: sessionId,
      });

      return result.data;
    } catch (err) {
      console.error("❌ Failed to generate report", err);
      throw new Error("Report generation failed"); // Force the parent try/catch to trigger
    }
  };

  // const GenerateReport = async () => {
  //   const result = await axios.post('/api/medical-report', {
  //     messages: messages,
  //     sessionDetail: sessionDetail,
  //     sessionId: sessionId,
  //   });

  //   return result.data;
  // };

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="p-10 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1  border rounded-md flex gap-1 items-center text-xs md:text-sm lg:text-md text-center">
          <div
            className={`w-3 h-3 rounded-full ${
              callStarted ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {callStarted ? "Connected" : "Not Connected"}
        </h2>

        <h2 className="font-bold text-sm md:text-md  text-gray-400">
          {formatTime(callDuration)}
        </h2>
      </div>
      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <div className="relative w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] aspect-square mx-auto">
            {/* Neon ambient background glow */}
            <div className="absolute inset-0 z-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(34,211,153,0.2),_transparent_70%)] blur-2xl pointer-events-none" />

            {/* Voice wave rings */}
            {isSpeaking && (
              <>
                <span className="absolute inset-0 rounded-full border border-emerald-400 animate-pingFast pointer-events-none" />
                <span className="absolute inset-0 scale-[1.1] rounded-full border border-emerald-500 animate-pingSlow opacity-40 pointer-events-none" />
                <span className="absolute inset-0 scale-[1.2] rounded-full border border-emerald-500/20 animate-pingSlower pointer-events-none" />
              </>
            )}

            {/* Avatar */}
            <div
              className={`relative z-10 w-[80%] h-[80%] mx-auto rounded-full overflow-hidden transition-all duration-300
      ${
        isSpeaking
          ? "ring-4 ring-emerald-400/80 animate-neonSpeak shadow-[0_0_100px_rgba(52,211,153,0.5)]"
          : "ring-2 ring-gray-300 shadow-md"
      }
    `}
            >
              <Image
                src={sessionDetail?.selectedDoctor?.image}
                alt={sessionDetail?.selectedDoctor?.specialist}
                width={160}
                height={160}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <h2 className="mt-2 text-xl">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-400">Your AI Medical Doctor</p>
          <div className="mt-12 w-full max-w-5xl min-w-[240px] min-h-[250px] max-h-[80vh] md:h-[290px] lg:h-[380px] xl:h-[400px] overflow-y-auto rounded-2xl backdrop-blur-md bg-white/60 border border-gray-200 shadow-inner px-4 py-6 space-y-4 transition-all duration-300 scroll-smooth">
            {/* Show before call starts if no messages */}
            {!callStarted && messages.length === 0 && !liveTranscript && (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-center text-gray-400 text-sm font-medium">
                  Your conversations will be appear here..
                </p>
              </div>
            )}

            {/* Show past messages */}
            {messages.length > 0 &&
              messages?.slice(-8).map((msg: messages, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    msg.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-md text-sm leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-white text-gray-800 rounded-bl-none"
                        : "bg-emerald-500 text-white rounded-br-none"
                    }`}
                  >
                    <p className="font-semibold capitalize mb-1 opacity-70">
                      {msg.role}
                    </p>
                    <p>{msg.text}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                      You
                    </div>
                  )}
                </div>
              ))}

            {/* Live transcript */}
            {liveTranscript && (
              <div
                className={`flex items-start gap-3 ${
                  currentRole === "assistant" ? "justify-start" : "justify-end"
                } animate-fade-in`}
              >
                {currentRole === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-200 text-emerald-800 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    AI
                  </div>
                )}
                <div
                  className={`relative max-w-[75%] px-4 py-3 rounded-2xl text-sm transition-all duration-200 shadow-lg ring-2 ring-emerald-400/50 ${
                    currentRole === "assistant"
                      ? "bg-white text-gray-800 rounded-bl-none"
                      : "bg-emerald-100 text-emerald-900 rounded-br-none"
                  }`}
                >
                  <div className="absolute -top-2 -right-3 animate-ping h-2 w-2 rounded-full bg-emerald-400 opacity-75"></div>
                  <p className="font-semibold capitalize mb-1 opacity-70">
                    {currentRole}{" "}
                    <span className="ml-1 text-[10px] text-emerald-400">
                      speaking…
                    </span>
                  </p>
                  <p>{liveTranscript}</p>
                </div>
                {currentRole === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                    U
                  </div>
                )}
              </div>
            )}
          </div>

          {!callStarted ? (
            <Button
              onClick={StartCall}
              disabled={!sessionDetail || isLoading}
              className="cursor-pointer transform rounded-lg border bg-emerald-400 px-8 py-2 font-medium text-black transition-all duration-300  hover:bg-emerald-900 hover:text-white dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900  w-auto mt-14"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <PhoneIcon /> Start Call
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={endCall}
              disabled={isLoading}
              variant={"destructive"}
              className="w-auto mt-20 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Disconnecting...
                </>
              ) : (
                <>
                  <PhoneOff /> End Call
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MedicalVoiceAgent;
