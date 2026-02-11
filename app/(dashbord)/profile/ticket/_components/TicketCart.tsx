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
    <div className="bg-neutral-700 p-4 rounded-three flex flex-col  gap-y-4">
      <div className=" flex justify-between items-center">
        <div className="flex flex-col gap-y-2">
          <span className=" font-bold capitalize ">{ticket.eventName}</span>
          <span className="text-neutral-300">#{ticket.trackingCode}</span>
        </div>
        <span
          className={`${currentStatus.classes} capitalize px-4 py-2 rounded-full text-xs font-medium`}
        >
          {currentStatus.text}
        </span>
      </div>
      <hr className=" text-neutral-600" />
      <div className=" flex items-center justify-between">
        <div className=" flex items-center gap-x-2">
          <span className=" font-medium">Order Date</span>
          <span className="font-medium text-neutral-200 flex items-center gap-x-2">
            {DayText} {Day} {Month} <Ellipse className="fill-neutral-200" />{" "}
            {ticket.clock}
            {`${+ticket.clock.slice(0, 2) + 2 >= 12 ? " PM" : " AM"}`}
          </span>
        </div>
        <div className=" flex items-center gap-x-2">
          <span className=" font-medium">Total paid</span>
          <span className="font-medium text-neutral-200 flex items-center gap-x-2">
            ${ticket.totalPrice}
          </span>
        </div>
        <div className=" flex items-center gap-x-2">
          <span className=" font-medium">
            <Ticket className="fill-white" />
          </span>
          <span className=" text-neutral-200 flex items-center gap-x-2">
            {ticket.totalSeats} tickets
          </span>
        </div>
        <Link
          href={`ticket/${ticket.orderId}`}
          className="flex items-center gap-x-2 px-2 py-1 rounded-two cursor-pointer hover:bg-main/30 transition-all ease-in duration-150"
        >
          <span className="  text-main">Ticket Details</span>
          <span className=" text-main flex items-center gap-x-2">
            <ArrowRight className=" fill-main" />
          </span>
        </Link>
      </div>
    </div>
  );
};

export default TicketCart;
