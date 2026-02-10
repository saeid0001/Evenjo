import { SeatType } from "@/app/lib/useSeatStor";
import React from "react";

const TicketCart = ({ ticket }: { ticket: SeatType }) => {
  return (
    <div className="bg-neutral-700 p-4 rounded-three flex flex-col  gap-y-4">
      <div className=" flex justify-between items-center">
        <span className=" text-bold capitalize ">{ticket.event_name}</span>
        <span
          className={`${ticket.status === "sold" ? " bg-success-400/30 text-success-300" : " bg-warning-400 / 30 text-warning-200"} capitalize  px-4 py-2 rounded-full`}
        >
          {ticket.status === "sold" ? "Completed" : "Pending"}
        </span>
      </div>
      <hr className=" text-neutral-600" />
    </div>
  );
};

export default TicketCart;
