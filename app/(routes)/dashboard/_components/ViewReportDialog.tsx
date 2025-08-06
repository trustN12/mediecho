"use client";

import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from "moment";
import { Printer } from "lucide-react";
import { motion, useInView } from "framer-motion";

type Props = {
  record: SessionDetail;
};

export type Report = {
  agent: string;
  chiefComplaint: string;
  duration: string;
  medicationsMentioned: string[];
  recommendations: string[];
  sessionId: string;
  severity: string;
  summary: string;
  symptoms: string[];
  timestamp: string;
  user: string;
};

const TimelineItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative pl-6 border-l-2 border-blue-500 dark:border-blue-400"
    >
      <div className="absolute -left-2 top-0 bg-blue-500 dark:bg-blue-400 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 transition-transform duration-300 ease-in-out scale-100 group-hover:scale-125" />
      <h3 className="text-base md:text-lg font-semibold text-blue-600 dark:text-blue-400 mt-1">
        {title}
      </h3>
      <div className="mt-2 text-sm text-gray-800 dark:text-gray-300">
        {children}
      </div>
      <hr className="my-4 border-gray-200 dark:border-gray-700" />
    </motion.div>
  );
};

const ViewReportDialog = ({ record }: Props) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Mediecho AI Report</title>
            <style>
              body { font-family: sans-serif; background: #f8f9fa; color: #111; padding: 2rem; }
              h2, h3 { color: #2563eb; }
              ul { padding-left: 1rem; }
              .timeline { border-left: 2px solid #2563eb; padding-left: 1rem; }
              .dot { width: 10px; height: 10px; background: #2563eb; border-radius: 50%; position: absolute; left: -6px; top: 4px; }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      win.document.close();
      win.focus();
      win.print();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="cursor-pointer">
          View Report
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 bg-gray-50 dark:bg-[#1e1e1e] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <div className="flex justify-center gap-4 items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-emerald-500 dark:text-blue-400">
              Mediecho AI — Medical Report
            </h2>
            <Button
              onClick={handlePrint}
              variant="ghost"
              size="icon"
              className="h-6 w-6"
            >
              <Printer className="w-3 h-3" />
            </Button>
          </div>

          <DialogDescription asChild>
            <div ref={printRef} className="space-y-6">
              <div className="space-y-8">
                {/* Timeline Items */}
                <TimelineItem title="Session Info">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p>
                      <strong>Specialist:</strong>{" "}
                      {record?.selectedDoctor?.specialist}
                    </p>
                    <p>
                      <strong>Patient:</strong>{" "}
                      {record.report?.user &&
                        record.report.user.charAt(0).toUpperCase() +
                          record.report.user.slice(1)}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {moment(new Date(record?.createdOn)).format("LL")}
                    </p>
                    <p>
                      <strong>Agent:</strong> {record.report?.agent}
                    </p>
                  </div>
                </TimelineItem>

                <TimelineItem title="Chief Complaint">
                  <p>{record?.report?.chiefComplaint}</p>
                </TimelineItem>

                <TimelineItem title="Diagnosis Summary">
                  <p>{record?.report?.summary}</p>
                </TimelineItem>

                <TimelineItem title="Symptoms Observed">
                  <ul className="list-disc list-inside space-y-1">
                    {record.report?.symptoms?.map((symptom, i) => (
                      <li key={i}>
                        {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                      </li>
                    ))}
                  </ul>
                </TimelineItem>

                <TimelineItem title="Duration & Severity">
                  <p>
                    <strong>Duration:</strong>{" "}
                    {record.report?.duration &&
                      record.report.duration.charAt(0).toUpperCase() +
                        record.report.duration.slice(1)}
                  </p>
                  <p>
                    <strong>Severity:</strong>{" "}
                    {record.report?.severity &&
                      record.report.severity.charAt(0).toUpperCase() +
                        record.report.severity.slice(1)}
                  </p>
                </TimelineItem>

                <TimelineItem title="Medications Prescribed">
                  <ul className="list-disc list-inside space-y-1">
                    {record.report?.medicationsMentioned?.map((med, i) => (
                      <li key={i}>
                        {med.charAt(0).toUpperCase() + med.slice(1)}
                      </li>
                    ))}
                  </ul>
                </TimelineItem>

                <TimelineItem title="AI Recommendations">
                  <ul className="list-disc list-inside space-y-1">
                    {record.report?.recommendations?.map((rec, i) => (
                      <li key={i}>
                        {rec.charAt(0).toUpperCase() + rec.slice(1)}
                      </li>
                    ))}
                  </ul>
                </TimelineItem>

                <div className="text-[10px] text-center text-gray-400 dark:text-gray-600 pt-2 print:text-black">
                  This timeline was auto-generated by Mediecho AI. Please
                  consult a licensed physician for clinical decisions.
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;
