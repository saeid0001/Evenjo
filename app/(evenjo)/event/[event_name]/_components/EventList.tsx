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
    <div className="px-rl my-14 flex flex-col items-center">
      <div className=" grid grid-cols-12 gap-x-4">
        {item.map((val) => {
          return (
            <div key={val.id} className=" col-span-3 h-fit">
              <EventCart value={val} />
            </div>
          );
        })}
      </div>

      {hasMore && (
        <button
          onClick={() => handelPagenation()}
          className="w-fit bg-main px-4 py-3 rounded-two cursor-pointer hover:bg-main/80"
        >
          {loading ? <LoadingDot /> : `View More ${type}`}
        </button>
      )}
    </div>
  );
};

export default EventList;
