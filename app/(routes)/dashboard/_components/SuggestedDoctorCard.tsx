import React from "react";
import { doctorAgent } from "./DoctorAgentCard";
import Image from "next/image";

type props = {
  doctorAgent: doctorAgent;
  setSelectedDoctor: any;
  selectedDoctor: doctorAgent;
};

const SuggestedDoctorCard = ({
  doctorAgent,
  setSelectedDoctor,
  selectedDoctor,
}: props) => {
  return (
    <div
      className={`flex flex-col items-center justify-center border rounded-2xl shadow p-4 hover:border-emerald-500 cursor-pointer ${
        selectedDoctor?.id===doctorAgent?.id && "border-emerald-500"
      }`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent?.image}
        alt={doctorAgent?.specialist}
        width={70}
        height={70}
        className="w-[55px] h-[55px] rounded-4xl object-cover"
      />
      <h2 className="font-bold text-sm text-center mt-2">
        {doctorAgent?.specialist}
      </h2>
      <p className="text-xs text-center line-clamp-2 mt-1">
        {doctorAgent?.description}
      </p>
    </div>
  );
};

export default SuggestedDoctorCard;
