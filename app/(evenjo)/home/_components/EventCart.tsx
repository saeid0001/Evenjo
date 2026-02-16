"use Client";

import concertDate from "@/app/lib/concertDate";
import {
  Event,
  EventData,
  getEventDate,
  getEventImage,
  getEventName,
} from "@/app/lib/types/event";
import { Calendar, Location } from "@/app/Ui/svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const EventCart = ({ value }: { value: Event }) => {
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const router = useRouter();
  const image = getEventImage(value.data);
  const name = getEventName(value.data);
  const date = getEventDate(value.data);

  const [year, month, day] = concertDate(date);

  return (
    <div
      key={value.id}
      onClick={() =>
        router.push(`/tickets/${name.replaceAll(" ", "")}_${value.data.id}`, {
          scroll: true,
        })
      }
      className="w-full h-fit relative cursor-pointer group"
    >
      <div className="relative w-full aspect-3/4 sm:aspect-3/4 lg:aspect-video lg:h-84 -z-10 rounded-four overflow-hidden">
        <div className="absolute inset-0 bg-tint-400 z-10 opacity-0 group-hover:opacity-15 transition-all duration-150" />

        {isLoadingImg && (
          <div className="absolute inset-0 bg-shade-400 animate-pulse " />
        )}

        <Image
          src={image[0] || "/locationicon5.png"}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center h-full w-full"
          onLoad={() => setIsLoadingImg(false)}
        />
      </div>
      <div className=" min-h-42 z-20 w-[90%] mx-auto -translate-y-10 bg-neutral-800 group-hover:bg-neutral-400 transition-all ease-in duration-150 border border-neutral-500 rounded-four flex flex-col justify-between p-4 gap-y-2 ">
        <h3 className="text-[18px] lg:text-[20px] font-bold line-clamp-1 capitalize ">
          {name}
        </h3>
        <div className=" flex flex-col sm:flex-row justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 fill-neutral-200" />
            <span className=" text-neutral-200 text-[12px] lg:text-[14px]">
              {`${month} ${day} - ${year}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Location className="w-3.5 h-3.5 " />
            <span className=" text-neutral-200 text-[12px] lg:text-[14px] line-clamp-1 capitalize ">
              {value.data.location.name}
            </span>
          </div>
        </div>
        <span className=" text-[16px] text-tint-400 font-bold">
          from ${Math.min(...value.data.turn[0].price)}
        </span>
      </div>
    </div>
  );
};

export default EventCart;
