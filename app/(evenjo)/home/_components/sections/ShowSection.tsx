"use client";

import LoadingDot from "@/app/components/LoadingDot";
import { getShowSortBycategory } from "@/app/lib/server";
import { Show } from "@/app/lib/types/event";
import { Calendar, Location } from "@/app/Ui/svg";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Props<T> = {
  data: T[];
  title: string;
};

const ShowSection = <T extends Show>({ data, title }: Props<T>) => {
  const [isLoadingImg, setIsLoadingImg] = useState(true);
  const searchParams = useSearchParams();
  const UpdateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("show", category);
    window.history.pushState(null, "", `?${params.toString()}`);
  };
  const getSearchParams = searchParams.get("show");

  const dataStructure = data.map((val) => val.data);
  const getAllCategory = [
    "All",
    ...new Set(dataStructure.map((cal) => cal.category)),
  ];

  const { data: dataConcert, isLoading } = useQuery({
    queryKey: ["show", getSearchParams],
    queryFn: () => getShowSortBycategory(getSearchParams || "All"),
  });

  const dataStructureConcert = dataConcert?.map((val) => val.data);

  console.log(searchParams.get("show"));

  return (
    <div className="flex flex-col px-rl">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-700">
        <span className=" text-[28px] font-semibold">{title}</span>
        <Link
          href={"/"}
          className="text-[16px] hover:text-tint-400 transition-all ease-in duration-150"
        >
          See all
        </Link>
      </div>
      <div className="flex gap-2 my-4">
        {getAllCategory.map((cat) => {
          return (
            <button
              onClick={() => UpdateCategory(cat)}
              key={cat}
              className={`
                ${
                  searchParams.get("show") === null && cat === "All"
                    ? " text-tint-400 bg-gradient-cool border-tint-400"
                    : ""
                }
                ${
                  searchParams.get("show") === cat
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
          dataStructureConcert?.map((value) => {
            return (
              <div
                key={value.id}
                className="w-full h-full relative cursor-pointer group mb-20"
              >
                <div className="relative w-full h-84 rounded-four overflow-hidden">
                  <div className=" absolute inset-0 bg-tint-400 z-10 opacity-0 group-hover:opacity-15 transition-all ease-in duration-150" />
                  {isLoadingImg && (
                    <div className="absolute inset-0 bg-shade-400 animate-pulse " />
                  )}
                  <Image
                    src={value.imageshow[0]}
                    alt={value.nameshow}
                    fill
                    className=" object-cover object-top h-full w-full"
                    onLoad={() => setIsLoadingImg(false)}
                  />
                </div>
                <div className=" absolute min-h-32 z-20 top-[80%] w-[90%] left-[50%] -translate-x-[50%] bg-neutral-800 group-hover:bg-neutral-400 transition-all ease-in duration-150 border border-neutral-500 rounded-four flex flex-col p-4 gap-y-2">
                  <h3 className="text-[20px] font-bold line-clamp-1">
                    {value.nameshow}
                  </h3>
                  <div className=" flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className=" text-neutral-200 text-[14px]">
                        {value.datashow}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Location className="w-3.5 h-3.5" />
                      <span className=" text-neutral-200 text-[14px] line-clamp-1">
                        {value.location.name}
                      </span>
                    </div>
                  </div>
                  <span className=" text-[16px] text-tint-400 font-bold">
                    from ${Math.min(...value.turn[0].price)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ShowSection;
