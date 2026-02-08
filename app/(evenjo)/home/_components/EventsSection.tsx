"use client";

import LoadingDot from "@/app/components/LoadingDot";
import { getAllDataByNameTable } from "@/app/lib/server";
import { EventData } from "@/app/lib/types/event";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import EventCart from "./EventCart";
import { useSearchParams } from "next/navigation";

type DataEvents = {
  id: string;
  data: EventData;
  created_at: string;
};

type Props<T extends DataEvents> = {
  data?: T[];
  title: string;
  eventType: string;
  idPerform?: string;
};

const EventsSection = <T extends DataEvents>({
  data,
  title,
  eventType,
  idPerform,
}: Props<T>) => {
  const searchParams = useSearchParams();
  const UpdateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(eventType, category);
    window.history.pushState(null, "", `?${params.toString()}`);
  };
  const getSearchParams = searchParams.get(eventType);

  const dataStructure = data?.map((val) => val.data);
  const getAllCategory = [
    "All",
    ...new Set(dataStructure?.map((cal) => cal.category)),
  ];

  const { data: dataConcert, isLoading } = useQuery({
    queryKey: [eventType, getSearchParams],
    queryFn: () =>
      getAllDataByNameTable(
        getSearchParams || "All",
        `${eventType}s`,
        idPerform,
      ),
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-700">
        <span className=" text-[28px] font-semibold">{title}</span>
        <Link
          href={`/event/${eventType}s`}
          className="text-[16px] hover:text-tint-400 transition-all ease-in duration-150"
        >
          See all
        </Link>
      </div>
      <div className="flex gap-2 my-4">
        {data &&
          getAllCategory?.map((cat) => {
            return (
              <button
                onClick={() => UpdateCategory(cat)}
                key={cat}
                className={`
                ${
                  searchParams.get(eventType) === null && cat === "All"
                    ? " text-tint-400 bg-gradient-cool border-tint-400"
                    : ""
                }
                ${
                  searchParams.get(eventType) === cat
                    ? " text-tint-400 bg-gradient-cool border-tint-400"
                    : ""
                }  bg-neutral-500 hover:text-tint-400 text-neutral-100 cursor-pointer hover:bg-gradient-cool hover:border-tint-400 border rounded-four px-4 py-2 border-neutral-400 transition-all ease-in duration-150`}
              >
                {cat}
              </button>
            );
          })}
      </div>
      <div className="flex justify-between gap-4 py-4">
        {isLoading && <LoadingDot />}

        {!isLoading &&
          dataConcert?.map((value, index) => {
            return <EventCart key={index} value={value} />;
          })}
      </div>
    </div>
  );
};

export default EventsSection;
