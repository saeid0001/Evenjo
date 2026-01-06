import { Turn } from "@/app/lib/types/event";
import { Bookmark, Calendar, Clock, Location, Share } from "@/app/Ui/svg";

interface TypeTikets {
  turnsItem: Turn;
  eventData: string;
}

const TimeCardTicket = ({ turnsItem, eventData }: TypeTikets) => {
  console.log(turnsItem);

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
          <button className="px-4 py-0.75 text-main border border-main rounded-two">
            Get Tickets
          </button>
        </div>
      </div>
      <div className=" flex justify-between items-end">
        <div className="flex flex-col">
          <div className="flex items-center text-[16px] text-neutral-200 gap-2">
            <Calendar className=" w-4 h-4" />
            {eventData}
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
