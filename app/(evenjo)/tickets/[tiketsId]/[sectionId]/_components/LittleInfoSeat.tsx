"use client";

import { getAllEventSeats } from "@/app/lib/server";
import { SeatType } from "@/app/lib/useSeatStor";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const LittleInfoSeat = () => {
  const { data: getAllSeatEvent }: { data: SeatType[] | undefined } = useQuery({
    queryKey: ["eventSeats"],
    queryFn: async () => {
      return await getAllEventSeats();
    },
  });
  const getFackUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("guest_session_id")
      : null;

  const FilterOnSeatuser = getAllSeatEvent?.filter(
    (val) => val.user_id === getFackUserId,
  );

  const sec = FilterOnSeatuser?.[FilterOnSeatuser?.length - 1]?.section_id;
  const row = FilterOnSeatuser?.[FilterOnSeatuser?.length - 1]?.row;
  const seat = FilterOnSeatuser?.[FilterOnSeatuser?.length - 1]?.number;

  return (
    <>
      <div className=" flex justify-between items-center mt-10">
        <div className=" flex flex-col justify-center items-center gap-y-2">
          <span className=" text-neutral-100">SEC</span>
          <span className=" text-white font-bold text-[22px]">
            {sec ? sec : "?"}
          </span>
        </div>
        <div className=" w-0.5 h-lh bg-neutral-500 " />
        <div className=" flex flex-col justify-center items-center gap-y-2">
          <span className=" text-neutral-100">ROW</span>
          <span className=" text-white font-bold text-[22px]">
            {row ? row : "?"}
          </span>
        </div>
        <div className=" w-0.5 h-lh bg-neutral-500 " />
        <div className=" flex flex-col justify-center items-center gap-y-2">
          <span className=" text-neutral-100">SEAT</span>
          <span className=" text-white font-bold text-[22px]">
            {seat ? seat : "?"}
          </span>
        </div>
      </div>
    </>
  );
};
