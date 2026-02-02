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
    <div className=" mb-4 bg-neutral-900 rounded-four p-6 flex flex-col gap-y-5">
      <div className=" flex justify-between border-b border-neutral-300 border-dashed pb-5">
        <div className=" flex gap-4 items-center">
          <Location className=" fill-tint-600" />
          <span className=" text-[20px] font-bold">{turnsItem.halls}</span>
        </div>
        <div className=" flex items-center gap-4">
          <Share />
          <Bookmark />
          <Link
            className="px-4 cursor-pointer py-0.75 text-main border border-main hover:bg-main hover:text-neutral-800 hover:px-5 transition-all ease-in duration-150 rounded-two"
            href={`${path}/section_${turnsItem.turnnumbre}`}
          >
            Get Tickets
          </Link>
        </div>
      </div>
      <div className=" flex justify-between items-end">
        <div className="flex flex-col">
          <div className="flex items-center text-[16px] text-neutral-200 gap-2">
            <Calendar className=" w-4 h-4" />
            {`${month} ${day} - ${year}`}
          </div>
          <div className="flex items-center text-[16px] text-neutral-200 gap-2">
            <Clock />
            {turnsItem.clock}{" "}
            {Number(turnsItem.clock.slice(0, 2)) >= 12 ? "PM" : "AM"}
          </div>
        </div>
        <div className=" flex gap-2 h-fit">
          {turnsItem.category.map((pup) => {
            return (
              <span
                key={pup}
                className=" bg-warning-200/10 text-warning-200  px-4 py-2 rounded-three text-[12px]"
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
