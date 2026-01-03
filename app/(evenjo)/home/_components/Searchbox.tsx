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

  console.log(isLoading);
  console.log(data);

  return (
    <div className="mx-[calc(var(--spacing-rl)+104px)] rounded-three border border-neutral-500  bg-neutral-800 flex flex-col px-10 py-6 gap-y-4">
      <div className="flex justify-between ">
        {categoryItem.map((val) => {
          return (
            <div
              key={val.name}
              onClick={() => {
                setItemName(() => (itemName === val.name ? "" : val.name));
              }}
              className="flex relative flex-row-reverse px-6 py-3 rounded-three cursor-pointer items-center-safe gap-2 "
            >
              <span className="text-[18px]">{val.name}</span>
              {val.icon}
              <div
                className={`absolute inset-0 bg-linear-to-r from-shade-300 to-shade-100 blur-md ${
                  itemName === val.name
                    ? "opacity-40 animate-pulse"
                    : "opacity-0"
                } hover:opacity-40 transition-all ease-in duration-150`}
              />
            </div>
          );
        })}
      </div>
      <div className=" bg-neutral-600 w-full h-0.5" />
      <div className=" grid grid-cols-10 gap-4 items-baseline ">
        <div className=" col-span-4 border-r border-neutral-600 flex items-center gap-3">
          <Widget />
          <div className="flex flex-col">
            <span className="">what</span>
            <span className=" text-neutral-200">
              {!isLoading ? (
                !itemName ? (
                  "Event Type"
                ) : (
                  itemName
                )
              ) : (
                <LoadingDot />
              )}
              {}
            </span>
          </div>
        </div>
        <div className=" col-span-2 border-r border-neutral-600 flex items-center gap-3">
          <Location />
          <div className="flex flex-col">
            <span className="">where</span>
            <span className=" text-neutral-200">
              {!isLoading ? "Location" : <LoadingDot />}
            </span>
          </div>
        </div>
        <div className=" col-span-3 flex items-center gap-3">
          <Calendar />
          <div className="flex flex-col">
            <span className="">when</span>
            <span className=" text-neutral-200">
              {!isLoading ? "Data" : <LoadingDot />}
            </span>
          </div>
        </div>
        <div className=" col-span-1 justify-center w-fit rounded-two cursor-pointer bg-main hover:bg-tint-600 p-3 flex items-center gap-3 transition-all ease-in duration-150">
          <span>
            <Search />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Searchbox;
