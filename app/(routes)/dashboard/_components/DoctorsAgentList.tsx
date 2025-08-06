import { AIDoctorAgents } from "@/shared/list";
import React from "react";
import DoctorAgentCard from "./DoctorAgentCard";

type Props = {
  credits: number | null;
};

const DoctorsAgentList = ({ credits }: Props) => {
  return (
    <div className="mt-12">
      <h2 className="font-bold text-xl">AI Specialist Doctors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 mt-5">
        {AIDoctorAgents.map((doctor, index) => (
          <div key={index}>
            <DoctorAgentCard doctorAgent={doctor} credits={credits} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsAgentList;
