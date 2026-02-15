"use client";
import { IconTick, Pattern } from "@/app/Ui/svg";
import Link from "next/link";

const page = () => {
  return (
    <div className="w-full relative overflow-hidden min-h-svh flex items-center justify-center">
      <span className="w-full absolute inset-0 -z-10">
        <Pattern className="w-full h-full object-cover opacity-40 md:opacity-100" />
      </span>

      <div className="w-[90%] sm:translate-y-1/4 md:w-2/4 h-auto md:h-[80svh] mx-auto flex flex-col items-center gap-y-12 md:gap-y-10 py-10">
        <div className="relative flex flex-col items-center text-center">
          <h1 className="text-[32px] md:text-[40px] font-bold text-main leading-none">
            Thank You!
          </h1>
          <p className="text-[18px] md:text-[22px] mt-2 text-neutral-100">
            Your payment was successful
          </p>
          <span className="absolute -top-10 md:-top-12 -right-2 md:-right-5 scale-75 md:scale-100">
            <IconTick />
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md md:max-w-none">
          <Link
            href={"/"}
            className="w-full text-center border border-main px-4 py-3.5 md:py-3 transition-all duration-150 ease-in rounded-two cursor-pointer hover:bg-main/20 active:scale-[0.98]"
          >
            Back to Home
          </Link>
          <Link
            href={"/profile"}
            className="w-full text-center bg-main px-4 py-3.5 md:py-3 transition-all duration-150 ease-in rounded-two cursor-pointer hover:bg-main/80 active:scale-[0.98]"
          >
            Go To Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
