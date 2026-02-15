"use client";

import { updateStatus } from "@/app/lib/actionServer";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/app/lib/supabase";
import { SeatType, useSeatStor } from "@/app/lib/useSeatStor";
import { Calendar, Clock, Location, Ticket } from "@/app/Ui/svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const isOpen = useSeatStor((state) => state.selectItem);
  const route = useRouter();

  const handelClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    const checkSignIn = await supabase.auth.getUser();
    if (checkSignIn.data.user?.id) {
      await updateStatus(checkSignIn.data.user?.id, "payment");
      route.push("/payment?triggr=Tickets");
    } else {
      route.push("/signup");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            onClick={() => Toggle(false)}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer backdrop-blur-sm"
          />

          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={(e, info) => {
              if (info.offset.y > 150) Toggle(false);
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              duration: 0.4,
              ease: "circOut",
            }}
            className={`
          bg-neutral-800 fixed z-50 px-6 pb-8 pt-4 flex flex-col 
          bottom-0 left-0 right-0 w-full h-[80vh] rounded-t-[30px] 
          lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 
          lg:w-120 lg:h-auto lg:rounded-three
        `}
          >
            <div className="w-12 h-1.5 bg-neutral-600/50 rounded-full mx-auto mb-4 lg:hidden shrink-0" />

            <div className="shrink-0">
              <div className="w-full relative h-fit text-center mb-4">
                <Image
                  src="/removebg.webp"
                  alt="Seat Selection"
                  width={150}
                  height={40}
                  className="mx-auto"
                />
                <div className="absolute -z-10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-10 bg-red-500 blur-2xl opacity-30" />
              </div>

              <div className="flex items-center gap-x-2 mb-4">
                <Location className="fill-main! w-5 h-6" />
                <span className="text-[18px] font-bold">
                  Ticket Information
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-neutral-100 border-b border-neutral-700 pb-4">
                <div className="flex flex-col gap-y-1 text-xs md:text-sm">
                  <div className="flex items-center gap-x-2">
                    <Ticket className="fill-neutral-100 w-4 h-3.5" />
                    <span>{showDetailSeatCart?.length} Tickets</span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Location className="fill-neutral-100 w-4 h-3.5" />
                    <span className="line-clamp-1">{name}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-y-1 text-xs md:text-sm items-end sm:items-start">
                  <div className="flex items-center gap-x-2">
                    <Clock className="fill-neutral-100 w-4 h-3.5" />
                    <span>{clock}</span>
                  </div>
                  <div className="flex items-center gap-x-2">
                    <Calendar className="fill-neutral-100 w-4 h-3.5" />
                    <span>
                      {date?.day} {date?.month}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grow overflow-y-auto my-4 shadow-md pr-2 custom-scrollbar max-h-40 lg:max-h-55">
              <table className="w-full border-collapse">
                <tbody className="divide-y divide-neutral-700/40">
                  {showDetailSeatCart?.map((seat, index) => (
                    <tr key={index}>
                      <td className="py-3 text-sm md:text-base text-neutral-300 text-left">
                        Section {seat.section_name}
                      </td>
                      <td className="py-3 text-[16px] md:text-[18px] font-bold text-right tabular-nums text-white">
                        ${seat.price_paid?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="shrink-0 flex flex-col gap-y-4">
              <div className="flex justify-between items-center bg-neutral-900/60 p-4 rounded-two border border-neutral-700">
                <span className="font-bold text-neutral-400">Total</span>
                <span className="text-[22px] md:text-[24px] font-bold text-main tabular-nums">
                  $
                  {showDetailSeatCart
                    .reduce((acc, curr) => acc + curr.price_paid, 0)
                    ?.toLocaleString()}
                </span>
              </div>

              <div className="flex gap-x-3">
                <button
                  onClick={() => Toggle(false)}
                  className="flex-1 px-4 py-3.5 border border-main text-main rounded-two cursor-pointer font-bold text-sm active:scale-95 transition-transform"
                >
                  Back
                </button>
                <button
                  onClick={(e) => handelClick(e)}
                  className="flex-1 px-4 py-3.5 bg-main text-white rounded-two cursor-pointer font-bold text-sm shadow-lg shadow-main/20 active:scale-95 transition-transform"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalCart;
