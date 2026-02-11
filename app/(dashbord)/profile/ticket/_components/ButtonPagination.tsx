import { ArrowRight } from "@/app/Ui/svg";
import Link from "next/link";
import React from "react";

const ButtonPagination = ({
  buttonCount,
  page,
  params,
}: {
  buttonCount: unknown[];
  page: string;
  params: {
    [key: string]: string | undefined;
  };
}) => {
  return (
    <div className="flex items-center gap-x-5">
      <Link
        href={{
          query: {
            ...params,
            page: Number(page) - 1,
          },
        }}
        className={`${buttonCount.length - 1 === Number(page) ? " opacity-0  pointer-events-none" : "cursor-pointer"} rotate-180 p-2 bg-neutral-700 rounded-full hover:bg-main transition-all ease-in duration-150 `}
      >
        <ArrowRight className="fill-white" />
      </Link>
      <div className="flex gap-x-0.5 items-center bg-neutral-700 rounded-full w-fit">
        {buttonCount.map((_, index) => {
          return (
            <Link
              href={{
                query: {
                  ...params,
                  page: index + 1,
                },
              }}
              key={index}
              className={`py-2 px-4 ${Number(page) === index + 1 ? "bg-main" : ""} rounded-full hover:bg-main transition-all ease-in duration-150`}
            >
              {index + 1}
            </Link>
          );
        })}
      </div>
      <Link
        href={{
          query: {
            ...params,
            page: Number(page) + 1,
          },
        }}
        className={`${buttonCount.length === Number(page) ? " opacity-0  pointer-events-none" : "cursor-pointer"} p-2 bg-neutral-700 rounded-full hover:bg-main transition-all ease-in duration-150 `}
      >
        <ArrowRight className="fill-white" />
      </Link>
    </div>
  );
};

export default ButtonPagination;
