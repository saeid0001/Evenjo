"use client";
import LoadingDot from "@/app/components/LoadingDot";
import { getCustomEvent } from "@/app/lib/server";
import {
  Calendar,
  Dumbbell,
  FerrisWheel,
  Location,
  Masks,
  Music,
  Search,
  Widget,
} from "@/app/Ui/svg";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const categoryItem = [
  {
    name: "concerts",
    icon: <Music />,
  },
  {
    name: "shows",
    icon: <Masks />,
  },
  {
    name: "sports",
    icon: <Dumbbell />,
  },
  {
    name: "festivals",
    icon: <FerrisWheel />,
  },
];

const Searchbox = () => {
  const [itemName, setItemName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["myEvent", itemName],
    queryFn: () => getCustomEvent(itemName),
    enabled: !!itemName,
  });

  return (
    <div className="mx-6 md:mx-12 lg:mx-[calc(var(--spacing-rl)+104px)] rounded-three border border-neutral-500 bg-neutral-800 flex flex-col px-6 lg:px-10 py-6 gap-y-4 shadow-2xl">
      <div className="flex justify-between overflow-x-auto pb-2 lg:pb-0 gap-x-4 no-scrollbar">
        {categoryItem.map((val) => (
          <div
            key={val.name}
            onClick={() => setItemName(itemName === val.name ? "" : val.name)}
            className="flex relative flex-row-reverse px-4 lg:px-6 py-3 rounded-three cursor-pointer items-center shrink-0 gap-2"
          >
            <span
              className={`${itemName === val.name ? "z-10" : "z-0"} text-sm lg:text-[18px] whitespace-nowrap`}
            >
              {val.name}
            </span>
            <span className={`${itemName === val.name ? "z-10" : "z-0"}`}>
              {val.icon}
            </span>
            <div
              className={`absolute inset-0 bg-linear-to-r from-shade-300 to-shade-100 blur-md ${
                itemName === val.name ? "opacity-40 animate-pulse" : "opacity-0"
              } hover:opacity-40 transition-all duration-150`}
            />
          </div>
        ))}
      </div>

      <div className="bg-neutral-600 w-full h-0.5" />

      <div className="flex flex-col lg:grid lg:grid-cols-10 gap-6 lg:gap-4 items-center lg:items-baseline">
        <div className="w-full lg:col-span-4 border-b lg:border-b-0 lg:border-r border-neutral-600 pb-4 lg:pb-0 flex items-center gap-3">
          <Widget />
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400">what</span>
            <span className="text-neutral-200 text-sm lg:text-base">
              {!isLoading ? (
                !itemName ? (
                  "Event Type"
                ) : (
                  itemName
                )
              ) : (
                <LoadingDot />
              )}
            </span>
          </div>
        </div>

        <div className="w-full lg:col-span-2 border-b lg:border-b-0 lg:border-r border-neutral-600 pb-4 lg:pb-0 flex items-center gap-3">
          <Location />
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400">where</span>
            <span className="text-neutral-200 text-sm lg:text-base">
              {!isLoading ? "Location" : <LoadingDot />}
            </span>
          </div>
        </div>

        <div className="w-full lg:col-span-3 flex items-center gap-3">
          <Calendar />
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400">when</span>
            <span className="text-neutral-200 text-sm lg:text-base">
              {!isLoading ? "Date" : <LoadingDot />}
            </span>
          </div>
        </div>

        <div className="w-full lg:col-span-1 flex justify-center mt-2 lg:mt-0">
          <div className="w-full lg:w-fit rounded-two cursor-pointer bg-main hover:bg-tint-600 p-4 lg:p-3 flex items-center justify-center transition-all duration-150 shadow-lg">
            <Search />
            {/* <span className="lg:hidden ml-2 text-white font-bold">Search</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Searchbox;
