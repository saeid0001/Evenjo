import concertDate from "@/app/lib/concertDate";
import { getDataByIdUserSeat, userTicketByOrderId } from "@/app/lib/server";
import { getEventImage } from "@/app/lib/types/event";
import {
  ArrowAction,
  Calendar,
  Chair,
  Ellipse,
  Location,
  Seat,
} from "@/app/Ui/svg";
import Image from "next/image";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ ticketOrderId: string }>;
}) => {
  const { ticketOrderId } = await params;
  const ticket = await userTicketByOrderId(ticketOrderId);
  const eventDetails = await getDataByIdUserSeat(
    ticket[0].event_type,
    ticket[0].event_id,
  );

  const imageEvent = getEventImage(eventDetails[0].data);
  const locationEvent = eventDetails[0].data.location.name;
  const eventType = ticket[0].event_type;
  const eventName = ticket[0].event_name;
  const [, Month, Day, DayText] = concertDate(
    String(new Date(ticket[0].created_at!).getDate()),
  );
  const clock = ticket[0].clock;
  const clockCreateAy = `${new Date(ticket[0].created_at!).getHours()}:${new Date(ticket[0].created_at!).getMinutes().toString().padStart(2, "0")}`;
  const [, MonthDate, DayDate, DayTextDate] = concertDate(ticket[0].date);
  const informationTickets = ticket.reduce(
    (acc: Record<string, Record<string, number[]>>, cur) => {
      const section = cur.section_name;
      const row = cur.row;

      if (!acc[section]) acc[section] = {};
      if (!acc[section][row]) acc[section][row] = [];

      acc[section][row].push(cur.number);
      return acc;
    },
    {},
  );
  const ticketCount = ticket.length;
  const totalPrice = ticket.reduce((acc, item) => acc + item.price_paid, 0);
  const transactionID = ticket[0].trackingCode;

  console.log(transactionID);

  return (
    <div className=" flex flex-col gap-y-8">
      <div className=" flex gap-x-10">
        <div className="w-[25%] flex flex-col items-center gap-y-2">
          <div className=" relative w-full h-50">
            <Image
              src={imageEvent[0]}
              alt=""
              fill
              className="object-cover rounded-three"
            />
          </div>
          <span className=" capitalize text-[20px] font-bold">
            {eventType} {eventName}
          </span>
        </div>
        <div className="w-[75%] flex flex-col justify-center gap-y-10">
          <div className=" flex justify-between">
            <span className=" text-[24px] font-bold text-main">
              Order Details
            </span>
            <button className=" text-main border border-main flex  items-center gap-x-2 cursor-pointer px-4 py-2 rounded-two">
              <ArrowAction />
              Download ticket
            </button>
          </div>
          <div className=" flex justify-between items-center">
            <div className="flex flex-col gap-y-2">
              <span className=" font-medium">Order Tracking Code</span>
              <span className=" text-neutral-100"># {transactionID}</span>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className=" font-medium">Order Date</span>
              <span className=" text-neutral-100">{`${DayText} ${Day} ${Month} - ${clockCreateAy} ${+clockCreateAy.slice(0, 2) + 2 >= 12 ? " PM" : " AM"}`}</span>
            </div>
            <button className=" bg-success-300/8 text-success-300 px-4 py-2 rounded-three">
              Success
            </button>
          </div>
        </div>
      </div>
      <div className=" flex flex-col gap-y-2">
        <div className="flex items-center gap-x-4 ">
          <span className=" text-tint-400 text-[24px] font-bold text-nowrap">
            Event Details
          </span>
          <span className=" w-full h-px bg-neutral-500" />
        </div>
        <div className=" flex justify-between items-center">
          <div className="flex flex-col gap-y-2">
            <span className=" font-medium flex items-center gap-x-2 text-[18px]">
              <Location className="w-6 h-6 fill-white" />
              Location
            </span>
            <span className=" text-neutral-100">{locationEvent}</span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className=" font-medium flex items-center gap-x-2 text-[18px]">
              <Calendar className="w-6 h-6 fill-white" />
              Event Date
            </span>
            <span className=" text-neutral-100">{`${MonthDate} ${DayDate} ${DayTextDate} - ${clock} ${+clock.slice(0, 2) + 2 >= 12 ? " PM" : " AM"}`}</span>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className=" font-medium flex items-center gap-x-2 text-[18px]">
              <Chair className="w-6 h-6 fill-white" />
              Selected Seat
            </span>
            <div className=" text-neutral-100 px-2 flex flex-col max-h-20 overflow-y-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-[10px]">
              {Object.entries(informationTickets).map(([sectionName, rows]) => (
                <div
                  key={sectionName}
                  className="flex items-start justify-between gap-y-3"
                >
                  <h3 className="text-success-300 text-xl font-semibold flex items-center gap-2">
                    {sectionName}
                  </h3>

                  <div className="flex flex-col pl-4">
                    {Object.entries(rows).map(([rowName, numbers]) => (
                      <div
                        key={rowName}
                        className="flex flex-wrap items-center gap-x-3 text-lg text-white"
                      >
                        <span className="flex items-center gap-x-2 text-neutral-100">
                          Row: <strong className="text-white">{rowName}</strong>
                          <Ellipse className="w-2 h-2 fill-success-300" />
                        </span>

                        <span className="text-neutral-100">Seats:</span>
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-4 ">
          <span className=" text-tint-400 text-[24px] font-bold text-nowrap">
            Payment
          </span>
          <span className=" w-full h-px bg-neutral-500" />
        </div>
        <div className=" flex justify-between w-full">
          <div className="flex flex-col gap-y-10">
            <div className="flex flex-col gap-y-2">
              <span className=" text-[18px] font-medium">Ticket count</span>
              <span className=" text-neutral-100">{ticketCount} tickets</span>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className=" text-[18px] font-medium">Paid by</span>
              <span className=" text-neutral-100">Negar khosravi</span>
            </div>
          </div>
          <span className=" w-10 h-full bg-neutral-300" />
          <div className="flex flex-col gap-y-10">
            <div className="flex flex-col gap-y-2">
              <span className=" text-[18px] font-medium">
                Transaction costs
              </span>
              <span className=" text-neutral-100">$100</span>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className=" text-[18px] font-medium">Payment method</span>
              <span className=" text-neutral-100">Stripe</span>
            </div>
          </div>
          <span className=" w-1 h-full bg-neutral-100" />
          <div className="flex flex-col gap-y-10">
            <div className="flex flex-col gap-y-2">
              <span className=" text-[18px] font-medium">Total paid</span>
              <span className=" text-neutral-100">
                ${(totalPrice + 100).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-y-2">
              <span className=" text-[18px] font-medium">Transaction ID</span>
              <span className=" text-neutral-100">{transactionID}</span>
            </div>
          </div>
          <span className=" w-10 h-full bg-neutral-300" />
          <div>QR Code</div>
        </div>
      </div>
    </div>
  );
};

export default page;
