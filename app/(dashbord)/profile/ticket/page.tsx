import profileAuth from "@/app/hooks/profileAuth";
import { getAllEventSeatsByUserId } from "@/app/lib/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import TicketCart from "./_components/TicketCart";

const page = async () => {
  const { id } = await profileAuth();
  const ticketUser = await getAllEventSeatsByUserId(id);

  const informationTickets = ticketUser.reduce(
    (acc: Record<string, { [cur.row]: number[] }>, cur) => {
      if (!acc[cur.event_name]) {
        acc[cur.event_name] = {
          [cur.row]: [cur.number],
        };
      } else if (acc[cur.event_name][cur.row]) {
        acc[cur.event_name][cur.row].push(cur.number);
      } else if (!acc[cur.event_name][cur.row]) {
        acc[cur.event_name] = {
          ...acc[cur.event_name],
          [cur.row]: [cur.number],
        };
      }
      return acc;
    },
    {},
  );

  console.log(informationTickets);
  

  return (
    <>
      {ticketUser.length === 0 && (
        <div className=" flex flex-col items-center justify-center gap-y-4 h-full">
          <div className=" relative w-50 h-50">
            <Image
              src="/basket1.webp"
              alt="ooops!!!"
              fill
              className=" object-cover"
            />
          </div>
          <span>ooops!!!</span>
          <span className=" w-[40%] text-center text-neutral-100">
            You haven’t booked any tickets yet. Explore exciting events and
            secure your spot now!
          </span>
          <Link
            href={"/"}
            className=" bg-main px-4 py-2 w-[40%] rounded-two cursor-pointer hover:bg-main/80 transition-all ease-in duration-150"
          >
            Brows Events
          </Link>
        </div>
      )}
      {ticketUser.length !== 0 && (
        <div className="flex flex-col gap-y-4">
          {ticketUser.map((tickets) => {
            return <TicketCart key={tickets.id} ticket={tickets} />;
          })}
        </div>
      )}
    </>
  );
};

export default page;
