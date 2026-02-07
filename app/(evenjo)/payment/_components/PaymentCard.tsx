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

  const getSeatUser = await getAllEventSeatsByUserId(user!.id);

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
    (acc: Record<string, { [cur.row]: number[] }>, cur) => {
      if (!acc[cur.section_name]) {
        acc[cur.section_name] = {
          [cur.row]: [cur.number],
        };
      } else if (acc[cur.section_name][cur.row]) {
        acc[cur.section_name][cur.row].push(cur.number);
      } else if (!acc[cur.section_name][cur.row]) {
        acc[cur.section_name] = {
          ...acc[cur.section_name],
          [cur.row]: [cur.number],
        };
      }
      return acc;
    },
    {},
  );

  return (
    <div>
      <div className="relative w-full h-128.75 -z-10 ">
        <Image
          src={imageEvent}
          fill
          className="object-cover rounded-four p-1 z-10"
          alt={""}
        />
        <div className=" absolute inset-0 w-full h-full bg-neutral-500 rounded-four mask-b-from-15% " />
      </div>
      <div className="flex flex-col gap-y-4 bg-neutral-800 px-4 py-6 -translate-y-10 z-50 w-[90%] mx-auto rounded-four">
        <span className="capitalize text-[24px] font-medium">{nameEvent}</span>
        <div className=" text-neutral-100 flex flex-col">
          <span>
            {`${DayText} ${day} ${month}`} . {turnInfo.clock}
            {`${+turnInfo.clock.slice(0, 2) + 2 >= 12 ? " PM" : " AM"}`}
          </span>
          <span className=" capitalize">{locationEvent}</span>
        </div>
        <div>
          {Object.entries(informationTickets || {}).map(([key, val]) => {
            return (
              <div
                key={key}
                className=" flex gap-x-2 items-center flex-wrap gap-y-1"
              >
                <span className=" flex items-baseline gap-x-2 text-[20px] text-success-300 font-medium">
                  {key} :{" "}
                </span>
                {Object.entries(val).map(([row, num]) => {
                  return (
                    <React.Fragment key={row}>
                      <span className=" flex items-baseline gap-x-2 text-[20px] font-medium">
                        Row : {row}{" "}
                        <Ellipse className="fill-success-300" />{" "}
                      </span>
                      <span className="text-[20px] font-medium">Number :</span>
                      {num.map((n, index) => {
                        return (
                          <span key={n} className="text-[20px] font-medium">
                            {n}
                            {num.length > index + 1 && " - "}
                            {num.length === index + 1 && row.length < index && (
                              <span className=" text-main"> / </span>
                            )}
                          </span>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div>
          <span>{getSeatUser.length} tickets</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
