"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import moment from "moment";
import ViewReportDialog from "./ViewReportDialog";
import { motion } from "framer-motion";

type Props = {
  historyList: SessionDetail[];
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07 },
  }),
};

const HistoryTable = ({ historyList }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col justify-center items-center gap-2 border px-4 py-2 rounded-2xl bg-slate-100 shadow-md"
    >
      <Table>
        <TableCaption className="text-emerald-900 text-center underline">
          Your Previous Medical Reports
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">AI Medical Specialist</TableHead>
            <TableHead className="font-bold">Description</TableHead>
            <TableHead className="font-bold">Date</TableHead>
            <TableHead className="text-right font-bold">Report</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historyList.map((record: SessionDetail, index: number) => (
            <motion.tr
              key={index}
              custom={index}
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              className="border-b transition duration-300 hover:bg-slate-200"
            >
              <TableCell className="font-medium">
                {record.selectedDoctor?.specialist}
              </TableCell>
              <TableCell>{record.notes}</TableCell>
              <TableCell>
                {moment(new Date(record?.createdOn)).fromNow()}
              </TableCell>
              <TableCell className="text-right">
                <ViewReportDialog record={record} />
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
};

export default HistoryTable;
