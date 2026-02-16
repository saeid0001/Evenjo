import concertDate from "@/app/lib/concertDate";
import { getDataByIdUserSeat, userTicketByOrderId } from "@/app/lib/server";
import { getEventImage } from "@/app/lib/types/event";
import { Calendar, Chair, Location } from "@/app/Ui/svg";
import Image from "next/image";
import React from "react";
import TicketPDFDownloader from "../_components/TicketPDFDownloader";

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
    String(new Date(ticket[0].created_at!).toISOString()),
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

  const qrContent = `
EVENT: ${eventName.toUpperCase()}
TRACKING CODE: ${transactionID}
--------------------------
SEATS:
${Object.entries(informationTickets)
  .map(([section, rows]) =>
    Object.entries(rows)
      .map(
        ([row, nums]) =>
          `${section} | Row ${row} | Seats: ${nums.sort((a, b) => a - b).join(", ")}`,
      )
      .join("\n"),
  )
  .join("\n")}
--------------------------
TOTAL PAID: $${(totalPrice + 100).toLocaleString()}
ORDER DATE: ${DayText} ${Day} ${Month}
`.trim();

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrContent)}&bgcolor=28-28-28&color=c14fe6`;

  return (
    <div className="flex flex-col gap-y-8 h-full bg-neutral-800 rounded-three px-4 md:px-6 py-4 overflow-y-auto">
      <div className="flex flex-col md:flex-row gap-6 md:gap-x-10">
        <div className="w-full md:w-[25%] flex flex-col items-center gap-y-2">
          <div className="relative w-full bg-red-400/20 aspect-square md:aspect-auto md:h-50 lg:h-60 overflow-hidden rounded-three border border-neutral-700 shadow-sm">
            <Image
              src={imageEvent[0]}
              alt={eventName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 30vw, 250px"
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <span className="capitalize text-lg md:text-[20px] font-bold text-center">
            {eventType} {eventName}
          </span>
        </div>

        <div className="w-full md:w-[75%] flex flex-col justify-center gap-y-6 md:gap-y-10">
          <div className="flex flex-col-reverse gap-y-2 sm:flex-row justify-between items-center">
            <span className="text-xl md:text-[24px] font-bold text-main">
              Order Details
            </span>
            <TicketPDFDownloader
              eventName={eventName}
              imageEvent={imageEvent[1] || ""}
              location={locationEvent}
              eventDate={`${MonthDate} ${DayDate} ${DayTextDate}`}
              clock={clock}
              trackingCode={transactionID!}
              orderDate={`${DayText} ${Day} ${Month} - ${clockCreateAy}`}
              ticketCount={ticketCount}
              totalPrice={totalPrice}
              informationTickets={informationTickets}
            />
          </div>
          <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
            <div className="flex flex-col gap-y-1 md:gap-y-2 w-[45%] md:w-auto">
              <span className="font-medium text-sm md:text-base">
                Order Tracking Code
              </span>
              <span className="text-neutral-100 text-sm md:text-base">
                # {transactionID}
              </span>
            </div>
            <div className="flex flex-col gap-y-1 md:gap-y-2 w-[45%] md:w-auto">
              <span className="font-medium text-sm md:text-base">
                Order Date
              </span>
              <span className="text-neutral-100 text-xs md:text-base whitespace-nowrap">
                {`${DayText} ${Day} ${Month}`}
              </span>
            </div>
            <button className="w-full md:w-auto bg-success-300/10 text-success-300 px-4 py-2 rounded-three text-sm">
              Success
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-4">
          <span className="text-tint-400 text-xl md:text-[24px] font-bold text-nowrap">
            Event Details
          </span>
          <span className="w-full h-px bg-neutral-500" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-y-6 md:gap-x-4">
          <div className="flex flex-col gap-y-1 md:gap-y-2">
            <span className="font-medium flex items-center gap-x-2 text-base md:text-[18px]">
              <Location className="w-5 h-5 fill-white" />
              Location
            </span>
            <span className="text-neutral-100 text-sm md:text-base">
              {locationEvent}
            </span>
          </div>
          <div className="flex flex-col gap-y-1 md:gap-y-2">
            <span className="font-medium flex items-center gap-x-2 text-base md:text-[18px]">
              <Calendar className="w-5 h-5 fill-white" />
              Event Date
            </span>
            <span className="text-neutral-100 text-sm md:text-base">{`${MonthDate} ${DayDate} ${DayTextDate}`}</span>
          </div>
          <div className="flex flex-col gap-y-1 md:gap-y-2 w-full md:w-auto">
            <span className="font-medium flex items-center gap-x-2 text-base md:text-[18px]">
              <Chair className="w-5 h-5 fill-white" />
              Selected Seat
            </span>
            <div className="text-neutral-100 px-2 flex flex-col max-h-24 overflow-y-auto custom-scrollbar">
              {/* محتوای Seat با همان ساختار قبلی */}
              {Object.entries(informationTickets).map(([sectionName, rows]) => (
                <div key={sectionName} className="text-sm md:text-base mb-2">
                  <span className="text-success-300 font-bold">
                    {sectionName}:{" "}
                  </span>
                  {Object.entries(rows)
                    .map(([row, nums]) => `Row ${row} (${nums.join(",")})`)
                    .join(" | ")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-4">
          <span className="text-tint-400 text-xl md:text-[24px] font-bold text-nowrap">
            Payment
          </span>
          <span className="w-full h-px bg-neutral-500" />
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-row justify-between items-start gap-8 md:gap-x-4 w-full">
          <div className="flex flex-col gap-y-1 md:gap-y-6">
            <div className="flex flex-col gap-y-1">
              <span className="text-sm md:text-[18px] font-medium text-neutral-400 md:text-white">
                Ticket count
              </span>
              <span className="text-neutral-100 text-sm md:text-base">
                {ticketCount} tickets
              </span>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm md:text-[18px] font-medium text-neutral-400 md:text-white">
                Paid by
              </span>
              <span className="text-neutral-100 text-sm md:text-base">
                Negar khosravi
              </span>
            </div>
          </div>

          <span className="hidden md:block w-px h-32 bg-neutral-700" />

          <div className="flex flex-col gap-y-1 md:gap-y-6">
            <div className="flex flex-col gap-y-1">
              <span className="text-sm md:text-[18px] font-medium text-neutral-400 md:text-white">
                Transaction costs
              </span>
              <span className="text-neutral-100 text-sm md:text-base">
                $100
              </span>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm md:text-[18px] font-medium text-neutral-400 md:text-white">
                Payment method
              </span>
              <span className="text-neutral-100 text-sm md:text-base">
                Stripe
              </span>
            </div>
          </div>

          <span className="hidden md:block w-px h-32 bg-neutral-700" />

          <div className="flex flex-col gap-y-1 md:gap-y-6">
            <div className="flex flex-col gap-y-1">
              <span className="text-sm md:text-[18px] font-medium text-neutral-400 md:text-white">
                Total paid
              </span>
              <span className="text-neutral-100 text-sm md:text-base font-bold text-main">
                ${(totalPrice + 100).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-y-1">
              <span className="text-sm md:text-[18px] font-medium text-neutral-400 md:text-white">
                Transaction ID
              </span>
              <span className="text-neutral-100 text-[10px] md:text-sm break-all">
                #{transactionID}
              </span>
            </div>
          </div>

          <span className="hidden md:block w-px h-32 bg-neutral-700" />
          <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center p-2 rounded-two">
            <img
              src={qrImageUrl}
              alt="QR"
              className="w-24 md:w-32 h-auto rounded-two"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
