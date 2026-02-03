"use client";

import { useEffect } from "react";
import { Venues } from "@/app/lib/types/event";
import SeatCard from "./SeatCard";
import { useQueryEventSeats } from "@/app/hooks/useQueryEventSeats";
import { Calendar, Chair, Clock, Ticket } from "@/app/Ui/svg";
import LoadingDot from "@/app/components/LoadingDot";
import ModalCart from "./ModalCart";
import { useSeatStor } from "@/app/lib/useSeatStor";

const SelectionManagerSeat = ({
  getHalls,
  type,
  turn,
  eventName,
  eventId,
  clock,
  date,
}: {
  getHalls: Venues;
  type: string;
  turn: string;
  eventName: string;
  eventId: string;
  clock: string;
  date: {
    year: string;
    month: string;
    day: string;
  };
}) => {
  const [data, isLoading] = useQueryEventSeats();
  const popup = useSeatStor((state) => state.selectItem);
  const Toggle = useSeatStor((state) => state.setSelectItem);

  const getUserId =
    typeof window !== "undefined"
      ? localStorage.getItem("guest_session_id")
      : null;

  const showDetailSeatCart = data?.filter(
    (val) =>
      val.status === "selected" &&
      val.user_id === getUserId &&
      val.event_name === eventName &&
      val.event_type === type &&
      val.event_id === eventId &&
      val.turn_number === Number(turn),
  );

  useEffect(() => {
    if (showDetailSeatCart && showDetailSeatCart.length === 0) {
      Toggle(false);
    }
  }, [showDetailSeatCart, Toggle]);

  const giveNameAndNumber = showDetailSeatCart?.reduce(
    (acc: Record<string, { count: number; totalprice: number }>, curr) => {
      if (!acc[curr.section_name]) {
        acc[curr.section_name] = {
          count: 1,
          totalprice: curr.price_paid,
        };
      } else {
        acc[curr.section_name].count += 1;
        acc[curr.section_name].totalprice += curr.price_paid;
      }
      return acc;
    },
    {},
  );

  return (
    <>
      {isLoading && <LoadingDot />}
      {showDetailSeatCart?.length === 0 && !isLoading && (
        <div className="flex flex-col gap-y-4">
          {getHalls.sections.map((sec) => {
            return <SeatCard key={sec.id} sectionData={sec} />;
          })}
        </div>
      )}
      {showDetailSeatCart?.length !== 0 && !isLoading && (
        <div className="flex flex-col gap-y-4 bg-neutral-800 px-4 py-6 rounded-three mb-3">
          <div className="flex items-center gap-x-2">
            <Chair />
            <div className=" flex items-center gap-x-2 overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-[10px]">
              {Object.entries(giveNameAndNumber || {})?.map(
                ([name, data], index) => {
                  return (
                    <span
                      key={name}
                      className=" text-nowrap text-[20px] font-bold"
                    >
                      {name}
                      {` (${data.count})`}
                      {Object.keys(giveNameAndNumber || {}).length > 1 &&
                        Object.keys(giveNameAndNumber || {}).length - 1 >
                          index && <span> , </span>}
                    </span>
                  );
                },
              )}
            </div>
          </div>
          <div className=" flex flex-col gap-y-2">
            {Object.entries(giveNameAndNumber || {})?.map(([name, data]) => {
              return (
                <div key={name} className=" flex items-center justify-between">
                  <span>Total Price {name}</span>
                  <span className=" text-[18px] font-bold">
                    ${data.totalprice?.toLocaleString()}
                  </span>
                </div>
              );
            })}
            <div className=" flex items-center justify-between">
              <span>Total Price Seat </span>
              <span className=" text-[20px] font-bold text-main">
                $
                {showDetailSeatCart
                  ?.reduce((acc, curr) => acc + curr.price_paid, 0)
                  ?.toLocaleString()}
              </span>
            </div>
          </div>
          <div className=" flex flex-col gap-y-4">
            <div className=" flex items-center gap-x-2">
              <Ticket className=" fill-neutral-100 w-4.5 h-4.5" />
              <span className=" text-[16px] text-neutral-100">
                {showDetailSeatCart?.length} tickets
              </span>
            </div>
            <div className=" flex items-center gap-x-2">
              <Clock className=" fill-neutral-100 w-4.5 h-4.5" />
              <span className=" text-[16px] text-neutral-100">{clock}</span>
            </div>
            <div className=" flex items-center gap-x-2">
              <Calendar className=" fill-neutral-100 w-4.5 h-4.5" />
              <span className=" text-[16px] text-neutral-100">{`${date.month} ${date.day} - ${date.year}`}</span>
            </div>
          </div>
          <button
            onClick={() => Toggle(true)}
            className=" w-full px-4 py-1.5 bg-main text-white rounded-two cursor-pointer hover:bg-main/50 transition-all ease-in duration-150 font-bold"
          >
            Continue
          </button>
        </div>
      )}
      {popup && (
        <ModalCart
          showDetailSeatCart={showDetailSeatCart || []}
          name={getHalls.name}
          clock={clock}
          date={date}
        />
      )}
    </>
  );
};

export default SelectionManagerSeat;
