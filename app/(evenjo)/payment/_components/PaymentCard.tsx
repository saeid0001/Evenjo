// "use client";
// import { supabase } from "@/app/lib/supabase";
// import { useEffect } from "react";

import concertDate from "@/app/lib/concertDate";
import {
  getAllEventSeatsByUserId,
  getDataByIdUserSeat,
} from "@/app/lib/server";
import { getSupabase } from "@/app/lib/supabase-server";
import {
  getEventDate,
  getEventImage,
  getEventName,
} from "@/app/lib/types/event";
import { Ellipse } from "@/app/Ui/svg";
import Image from "next/image";
import React from "react";

const PaymentCard = async () => {
  const supabase = await getSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const getSeatUser = await getAllEventSeatsByUserId(user!.id, "payment");

  const [id, type, turn] = [
    ...new Set(getSeatUser.map((val) => val.event_id)),
    ...new Set(getSeatUser.map((val) => val.event_type)),
    ...new Set(getSeatUser.map((val) => val.turn_number)),
  ] as [string, string, number];

  const getInformationEvent = await getDataByIdUserSeat(type, id);
  const imageEvent = getEventImage(getInformationEvent[0].data)[0];
  const nameEvent = getEventName(getInformationEvent[0].data);
  const dateEvent = getEventDate(getInformationEvent[0].data);
  const [, month, day, DayText] = concertDate(dateEvent);
  const turnInfo = getInformationEvent[0].data.turn[turn - 1];
  const locationEvent = getInformationEvent[0].data.location.name;

  const informationTickets = getSeatUser.reduce(
    (acc: Record<string, Record<string, number[]>>, cur) => {
      const section = cur.event_name;
      const row = cur.row;

      if (!acc[section]) acc[section] = {};
      if (!acc[section][row]) acc[section][row] = [];

      acc[section][row].push(cur.number);
      return acc;
    },
    {},
  );

  console.log(informationTickets);

  return (
  <div>
  <div className="relative w-full h-64 md:h-128.75 -z-10">
    <Image
      src={imageEvent}
      fill
      className="object-cover rounded-four p-1 z-10"
      alt={""}
    />
    <div className="absolute inset-0 w-full h-full bg-neutral-500 rounded-four mask-b-from-15%" />
  </div>

  <div className="flex flex-col gap-y-4 bg-neutral-800 px-4 md:px-6 py-6 -translate-y-10 z-50 w-[92%] md:w-[90%] mx-auto rounded-four shadow-xl">
    <span className="capitalize text-xl md:text-[24px] font-medium leading-tight">
      {nameEvent}
    </span>

    <div className="text-neutral-100 flex flex-col text-sm md:text-base">
      <span>
        {`${DayText} ${day} ${month}`} . {turnInfo.clock}
        {`${+turnInfo.clock.slice(0, 2) + 2 >= 12 ? " PM" : " AM"}`}
      </span>
      <span className="capitalize">{locationEvent}</span>
    </div>

    <div className="border-t border-neutral-700 pt-4 flex flex-col gap-y-6">
      {Object.entries(informationTickets).map(([sectionName, rows]) => (
        <div key={sectionName} className="flex flex-col gap-y-3">
          <h3 className="text-success-300 text-lg md:text-xl font-semibold flex items-center gap-2">
            {sectionName}
          </h3>

          <div className="flex flex-col gap-y-4 pl-2 md:pl-4">
            {Object.entries(rows).map(([rowName, numbers]) => (
              <div
                key={rowName}
                className="flex flex-col sm:flex-row sm:items-center gap-y-1 gap-x-3 text-base md:text-lg text-white"
              >
                <span className="flex items-center gap-x-2 text-neutral-100 shrink-0">
                  Row: <strong className="text-white">{rowName}</strong>
                  <Ellipse className="w-1.5 h-1.5 md:w-2 md:h-2 fill-success-300" />
                </span>

                <div className="flex items-start gap-x-2">
                  <span className="text-neutral-100 shrink-0">Seats:</span>
                  <div className="flex flex-wrap gap-x-1 font-mono text-main">
                    {numbers
                      .sort((a, b) => a - b)
                      .map((n, idx) => (
                        <React.Fragment key={idx}>
                          <span>{n}</span>
                          {idx < numbers.length - 1 && (
                            <span className="text-neutral-100">,</span>
                          )}
                        </React.Fragment>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="border-t border-neutral-700 pt-4 mt-2">
      <span className="text-neutral-100 font-medium">
        {getSeatUser.length} tickets
      </span>
    </div>
  </div>
</div>
  );
};

export default PaymentCard;
