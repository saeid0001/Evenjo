"use client";

import { supabase } from "@/app/lib/supabase";
import { SeatType, useSeatStor } from "@/app/lib/useSeatStor";
import { Calendar, Clock, Location, Ticket } from "@/app/Ui/svg";
import { stat } from "fs";
import Image from "next/image";

const ModalCart = ({
  showDetailSeatCart,
  name,
  clock,
  date,
}: {
  showDetailSeatCart: SeatType[];
  name?: string;
  clock?: string;
  date?: { year: string; month: string; day: string };
}) => {
  const Toggle = useSeatStor((state) => state.setSelectItem);
  

  return (
    <>
      <div
        onClick={() => Toggle(false)}
        className="fixed inset-0 bg-black/50 z-40 cursor-pointer"
      />
      <div className="bg-neutral-800 overflow-hidden fixed top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 z-50 w-2/4 h-fit rounded-three px-8 py-6 flex flex-col justify-center gap-y-6">
        <div className="w-full relative">
          <Image
            src="/removebg.webp"
            alt="Seat Selection"
            width={300}
            height={100}
            className=" mx-auto mb-4 "
          />
          <div className=" absolute -z-10 rounded-full top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-2/4 bg-red-500 blur-3xl" />
        </div>
        <div className="flex items-end gap-x-2">
          <Location className=" fill-main! w-4.5 h-6 " />
          <span className=" text-[20px] font-bold">Ticket Information</span>
        </div>
        <div className="flex items-center justify-between text-neutral-100">
          <div className=" flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <Ticket className="fill-neutral-100 w-4 h-3.5" />
              <span>{showDetailSeatCart?.length} Tickets</span>
            </div>
            <div className="flex items-center gap-x-2">
              <Location className="fill-neutral-100 w-4 h-3.5" />
              <span>{name}</span>
            </div>
          </div>
          <div className=" flex flex-col gap-y-2">
            <div className="flex items-center gap-x-2">
              <Clock className="fill-neutral-100 w-4 h-3.5" />
              <span>{clock}</span>
            </div>
            <div className="flex items-center gap-x-2">
              <Calendar className="fill-neutral-100 w-4 h-3.5" />
              <span>
                {date?.day} {date?.month} {date?.year}
              </span>
            </div>
          </div>
        </div>
        <hr className=" border-neutral-500" />
        <table>
          <tbody>
            {showDetailSeatCart?.map((seat, index) => (
              <tr key={index} className="">
                <td className="py-2 px-4">{seat.section_name}</td>
                <td className="py-2 px-4 text-[18px] font-bold text-right tabular-nums">
                  ${seat.price_paid.toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className=" border-t border-neutral-500">
              <td className="py-2 px-4 font-bold">Total</td>
              <td className="py-2 px-4 text-[18px] font-bold text-right tabular-nums text-main">
                $
                {showDetailSeatCart
                  .reduce((acc, curr) => acc + curr.price_paid, 0)
                  ?.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <div className=" flex gap-x-3">
          <button
            onClick={() => Toggle(false)}
            className=" w-2/4 px-4 py-1.5 border border-main text-main rounded-two cursor-pointer hover:bg-neutral-600 transition-all ease-in duration-150 font-bold"
          >
            Change Seat
          </button>
          <button
            // onClick={handelClick}
            className=" w-2/4 px-4 py-1.5 bg-main text-white rounded-two cursor-pointer hover:bg-main/50 transition-all ease-in duration-150 font-bold"
          >
            Continue
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalCart;
