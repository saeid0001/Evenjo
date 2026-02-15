"use client";

import EventCart from "@/app/(evenjo)/home/_components/EventCart";
import LoadingDot from "@/app/components/LoadingDot";
import { getCustomEvent } from "@/app/lib/server";
import { Events } from "@/app/lib/types/event";
import { useState } from "react";

const EventList = ({
  data,
  count,
  type,
}: {
  data: Events;
  count: number;
  type: string;
}) => {
  const [item, setItme] = useState(data);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handelPagenation = async () => {
    console.log("Click");

    setLoading(true);
    const [data] = await getCustomEvent(type, page + 1);
    if (data.length > 0) {
      setItme((prv) => [...prv, ...data]);
      setPage(page + 1);
    }
    setLoading(false);
  };

  const hasMore = item.length < count;

  return (
    <div className="px-8 lg:px-rl my-10 md:my-14 flex flex-col items-center gap-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-x-4 w-full">
        {item.map((val) => {
          return (
            <div key={val.id} className="h-fit w-full">
              <EventCart value={val} />
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => handelPagenation()}
          className="w-full sm:w-fit bg-main px-8 py-3.5 rounded-two cursor-pointer hover:bg-main/80 transition-all active:scale-95 font-bold shadow-lg shadow-main/20"
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <LoadingDot />
            </div>
          ) : (
            `View More ${type}`
          )}
        </button>
      )}
    </div>
  );
};

export default EventList;
