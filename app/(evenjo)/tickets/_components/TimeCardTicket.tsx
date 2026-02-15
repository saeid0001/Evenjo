import concertDate from "@/app/lib/concertDate";
import { Turn } from "@/app/lib/types/event";
import { Bookmark, Calendar, Clock, Location, Share } from "@/app/Ui/svg";
import Link from "next/link";
// import { usePathname } from "next/navigation";

interface TypeTikets {
  turnsItem: Turn;
  eventData: string;
  path: string;
}

const TimeCardTicket = ({ turnsItem, eventData, path }: TypeTikets) => {
  // const path = usePathname()

  const [year, month, day] = concertDate(eventData);

  return (
    <div className="mb-4 bg-neutral-900 rounded-four p-4 md:p-6 flex flex-col gap-y-5">
      <div className="flex flex-col sm:flex-row justify-between border-b border-neutral-300 border-dashed pb-5 gap-y-4">
        <div className="flex gap-4 items-center">
          <Location className="fill-tint-600 shrink-0" />
          <span className="text-[18px] md:text-[20px] font-bold">
            {turnsItem.halls}
          </span>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="flex items-center gap-4">
            <Share />
            <Bookmark />
          </div>
          <Link
            className="px-4 cursor-pointer py-1.5 md:py-0.75 text-main border border-main hover:bg-main hover:text-neutral-800 lg:hover:px-5 transition-all ease-in duration-150 rounded-two text-sm md:text-base"
            href={`${path}/section_${turnsItem.turnnumbre}`}
          >
            Get Tickets
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row md:flex-row justify-between items-start md:items-end gap-y-4">
        <div className="flex sm:flex-col gap-x-2 gap-y-1">
          <div className="flex items-center text-[14px] md:text-[16px] text-neutral-200 gap-2">
            <Calendar className="w-4 h-4 fill-neutral-200" />
            {`${month} ${day} - ${year}`}
          </div>
          <div className="flex items-center text-[14px] md:text-[16px] text-neutral-200 gap-2">
            <Clock />
            {turnsItem.clock}{" "}
            {Number(turnsItem.clock.slice(0, 2)) >= 12 ? "PM" : "AM"}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 h-fit">
          {turnsItem.category.map((pup) => {
            return (
              <span
                key={pup}
                className="bg-warning-200/10 text-warning-200 px-3 md:px-4 py-1.5 md:py-2 rounded-three text-[10px] md:text-[12px] whitespace-nowrap"
              >
                {pup}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeCardTicket;
