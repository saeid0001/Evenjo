"use client";

import { Lock } from "@/app/Ui/svg";
import { useState } from "react";

const Popup = () => {
  const [pop, setPop] = useState(true);
  return (
    <>
      {pop && (
        <>
          <div
            onClick={() => setPop(false)}
            className="fixed inset-0 bg-black/50 z-40 cursor-pointer text-center"
          />
          <div className="w-[35%] fixed z-50 flex flex-col items-center gap-y-4 top-[50%] -translate-[50%] left-[50%] bg-neutral-700 p-6 rounded-three">
            <span className=" relative">
              <span className=" absolute bg-main blur-xl opacity-50 w-full h-full" />
              <Lock className="w-15 h-15" />
            </span>
            <span className=" text-[20px] font-bold text-center">
              You have 10 minutes to complete your purchase
            </span>
            <span className=" text-[18px] text-neutral-200 text-justify">
              The price of your tickets will be locked during this time
            </span>
            <button
              onClick={() => setPop(false)}
              className=" w-full px-4 py-2 bg-main text-white rounded-two cursor-pointer hover:bg-main/50 transition-all ease-in duration-150 font-bold"
            >
              Start
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Popup;
