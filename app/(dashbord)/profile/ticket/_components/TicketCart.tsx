import concertDate from "@/app/lib/concertDate";
import { TiketType } from "../page";
import { ArrowRight, Ellipse, Ticket } from "@/app/Ui/svg";
import Link from "next/link";

const TicketCart = ({ ticket }: { ticket: TiketType }) => {
  const statusMap = {
    sold: {
      text: "Completed",
      classes: "bg-success-400/30 text-success-300",
    },
    payment: {
      text: "Pending Payment",
      classes: "bg-warning-400/30 text-warning-200",
    },
    selected: {
      text: "Selected",
      classes: "bg-blue-400/30 text-blue-300",
    },
  } as const;
  const currentStatus = statusMap[ticket.status as keyof typeof statusMap];

  const [, Month, Day, DayText] = concertDate(ticket.date);

  return (
    <div className="bg-neutral-700 p-4 md:p-5 rounded-three flex flex-col gap-y-4 w-full">
      <div className="flex justify-between items-start md:items-center">
        <div className="flex flex-col gap-y-1 md:gap-y-2">
          <span className="font-bold capitalize text-sm md:text-base leading-tight">
            {ticket.eventName}
          </span>
          <span className="text-neutral-300 text-xs md:text-sm">
            #{ticket.trackingCode}
          </span>
        </div>
        <span
          className={`${currentStatus.classes} capitalize px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-medium shrink-0`}
        >
          {currentStatus.text}
        </span>
      </div>

      <hr className="border-neutral-600" />

      <div className="flex flex-wrap items-center justify-between gap-4 md:gap-x-2">
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-x-2 w-[45%] md:w-auto">
          <span className="text-[10px] md:text-sm font-medium text-neutral-400 md:text-white">
            Order Date
          </span>
          <span className="text-xs md:text-sm font-medium text-neutral-200 flex items-center gap-x-1">
            {DayText} {Day} {Month}
            <Ellipse className="hidden md:block w-1.5 h-1.5 fill-neutral-200 shrink-0" />
            <span className="md:inline block">
              {ticket.clock}{" "}
              {`${+ticket.clock.slice(0, 2) + 2 >= 12 ? "PM" : "AM"}`}
            </span>
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-x-2 w-[45%] md:w-auto">
          <span className="text-[10px] md:text-sm font-medium text-neutral-400 md:text-white">
            Total paid
          </span>
          <span className="text-xs md:text-sm font-medium text-neutral-200">
            ${ticket.totalPrice}
          </span>
        </div>

        <div className="flex items-center gap-x-2 w-[45%] md:w-auto">
          <Ticket className="fill-white w-4 h-4 md:w-5 md:h-5 shrink-0" />
          <span className="text-xs md:text-sm text-neutral-200 whitespace-nowrap">
            {ticket.totalSeats} tickets
          </span>
        </div>

        <Link
          href={`ticket/${ticket.orderId}`}
          className="flex items-center justify-center md:justify-start gap-x-1 px-2 py-2 md:py-1 rounded-two cursor-pointer hover:bg-main/30 transition-all bg-main/10 md:bg-transparent w-full md:w-auto mt-2 md:mt-0"
        >
          <span className="text-xs md:text-sm text-main font-bold md:font-medium whitespace-nowrap">
            Ticket Details
          </span>
          <ArrowRight className="fill-main w-4 h-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

export default TicketCart;
