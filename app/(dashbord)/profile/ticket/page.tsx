import profileAuth from "@/app/hooks/profileAuth";
import { getAllEventSeatsByUserId } from "@/app/lib/server";
import TicketCart from "./_components/TicketCart";
import NoTicket from "./_components/NoTicket";
import ButtonPagination from "./_components/ButtonPagination";
import Link from "next/link";

export interface TiketType {
  eventName: string;
  turn: number;
  totalPrice: number;
  totalSeats: number;
  status: string;
  clock: string;
  date: string;
  trackingCode: string;
  orderId: string;
  sections: {
    [sectionName: string]: {
      [rowName: string]: number[];
    };
  };
}

export interface GroupedTickets {
  [key: string]: TiketType;
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { id } = await profileAuth();
  const ticketUser = await getAllEventSeatsByUserId(id);
  const params = await searchParams;
  const page = params.page || "1";
  const status = params.status || "All";

  const allTicketsGrouped = ticketUser.reduce<GroupedTickets>((acc, item) => {
    const groupKey = `${item.event_name}-${item.turn_number}-${item.trackingCode}`;

    if (!acc[groupKey]) {
      acc[groupKey] = {
        eventName: item.event_name,
        turn: item.turn_number,
        totalPrice: 0,
        status: item.status,
        totalSeats: 0,
        clock: item.clock,
        date: item.date,
        sections: {},
        trackingCode: item.trackingCode || "",
        orderId: item.orderId || "",
      };
    }

    const sectionName = item.section_name;
    const rowName = `${item.row}`;

    if (!acc[groupKey].sections[sectionName]) {
      acc[groupKey].sections[sectionName] = {};
    }

    if (!acc[groupKey].sections[sectionName][rowName]) {
      acc[groupKey].sections[sectionName][rowName] = [];
    }

    acc[groupKey].sections[sectionName][rowName].push(item.number);
    acc[groupKey].totalPrice += item.price_paid;
    acc[groupKey].totalSeats += 1;

    return acc;
  }, {});

  const counts: Record<string, number> = { All: 0 };
  Object.values(allTicketsGrouped).forEach((ticket) => {
    counts["All"] += 1;
    const s = ticket.status;
    counts[s] = (counts[s] || 0) + 1;
  });


  const myTickets = Object.fromEntries(
    Object.entries(allTicketsGrouped).filter(([, ticket]) => {
      if (status === "All") return true;
      return ticket.status === status;
    }),
  );

  const buttonCount = Array.from({
    length: Math.ceil(Object.keys(myTickets).length / 4),
  });

  const statusFilter = ["All", ...new Set(ticketUser.map((val) => val.status))];

  return (
    <>
      {Object.entries(allTicketsGrouped).length === 0 && <NoTicket />}
      {Object.entries(allTicketsGrouped).length !== 0 && (
        <div className="flex flex-col gap-y-4 justify-between h-full bg-neutral-800 rounded-three px-6 py-4 overflow-y-auto ">
          <div className=" flex flex-col gap-y-4">
            <div className="flex gap-x-2">
              {statusFilter.map((val) => {
                const cardCount = counts[val] || 0;
                return (
                  <Link
                    key={val}
                    href={{
                      query: {
                        ...params,
                        page: 1,
                        status: val,
                      },
                    }}
                    className={` ${status === val ? "text-main" : "text-white"} capitalize flex flex-col relative group transition-all ease-in duration-150  justify-start px-4 py-2 cursor-pointer gap-x-2 items-center`}
                  >
                    <span>
                      {val === "sold" ? "Completed" : val} ( {cardCount} )
                    </span>
                    {status === val && (
                      <>
                        <div className="w-full h-1 absolute bottom-0 left-0 bg-main" />
                        <div className="w-full h-5 absolute bottom-0 left-0 opacity-30 bg-main mask-t-from-10%" />
                      </>
                    )}
                    <div className="transition-all ease-in duration-150 opacity-0 group-hover:opacity-100 w-full h-1 absolute bottom-0 left-0  bg-main" />
                    <div className="transition-all ease-in duration-150 opacity-0 group-hover:opacity-30  w-full h-5 absolute bottom-0 left-0 bg-main mask-t-from-10%" />
                  </Link>
                );
              })}
            </div>
            {Object.entries(myTickets)
              .slice((Number(page) - 1) * 4, Number(page) * 4)
              .map(([ticketName, sectionTicket]) => {
                return <TicketCart key={ticketName} ticket={sectionTicket} />;
              })}
          </div>
          {buttonCount.length !== 1 && (
            <ButtonPagination
              buttonCount={buttonCount}
              page={page}
              params={params}
            />
          )}
        </div>
      )}
    </>
  );
};

export default page;
