"use client";
import { IconTick, Pattern } from "@/app/Ui/svg";
import Link from "next/link";

const page = () => {
  return (
    <div className=" w-full ">
      <span className="w-full absolute inset-0 -z-10">
        <Pattern className=" w-full h-screen" />
      </span>
      <div className="w-2/4 h-[80svh]  mx-auto justify-center flex flex-col items-center gap-y-10">
        <div className="relative flex flex-col items-center">
          <span className="text-[40px] font-bold text-main">Thank You!</span>
          <span className="text-[22px]">Your payment was successful</span>
          <span className=" absolute -top-12 -right-5">
            <IconTick />
          </span>
        </div>
        <div className=" flex gap-x-4 w-full">
          <Link
            href={"/"}
            className=" w-full text-center border border-main px-4 py-3 transition-all duration-150 ease-in rounded-two cursor-pointer hover:bg-main/60"
          >
            Back to Home
          </Link>
          <Link
            href={"/profile"}
            className=" w-full text-center bg-main px-4 py-3 transition-all duration-150 ease-in rounded-two cursor-pointer hover:bg-main/60"
          >
            Go To Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
