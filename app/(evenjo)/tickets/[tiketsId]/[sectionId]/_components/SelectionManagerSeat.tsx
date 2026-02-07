"use client";

import { useEffect, useState } from "react";
import { Venues } from "@/app/lib/types/event";
import SeatCard from "./SeatCard";
import { useQueryEventSeats } from "@/app/hooks/useQueryEventSeats";
import { Calendar, Chair, Clock, Delete, Ticket } from "@/app/Ui/svg";
import LoadingDot from "@/app/components/LoadingDot";
import ModalCart from "./ModalCart";
import { useSeatStor } from "@/app/lib/useSeatStor";
import { supabase } from "@/app/lib/supabase";
import { deleteAllSeatWithUserId } from "@/app/lib/actionServer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const SelectionManagerSeat = ({
  getHalls,
  type,
  turn,
  eventName,
  eventId,
  clock,
  date,
  prices,
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
  prices: number[];
}) => {
  const [data, isLoading] = useQueryEventSeats();
  const [getUserId, setGetUserId] = useState("");
  const [isUserLoading, setIsUserLoading] = useState(true);
  const queryClient = useQueryClient();
  const popup = useSeatStor((state) => state.selectItem);
  const Toggle = useSeatStor((state) => state.setSelectItem);

  useEffect(() => {
    const storedUserId =
      typeof window !== "undefined"
        ? localStorage.getItem("guest_session_id")
        : null;
    const fetchAuth = async () => {
      setIsUserLoading(true);
      const getUser = await supabase.auth.getUser();
      if (getUser.data.user?.id) {
        setGetUserId(getUser.data.user?.id);
      } else {
        setGetUserId(storedUserId || "");
      }
      setIsUserLoading(false);
    };
    fetchAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setGetUserId(session.user.id);
      } else {
        const storedUserId = localStorage.getItem("guest_session_id");
        setGetUserId(storedUserId || "");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const showDetailSeatCart = data?.filter(
    (val) =>
      (val.status === "selected" || val.status === "payment") &&
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

  const mutation = useMutation({
    mutationFn: async () => {
      return await deleteAllSeatWithUserId(
        showDetailSeatCart![0].user_id!,
        "selected",
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventSeats"] });
    },
    onError: (error) => {
      console.log(error.message);
      alert(error.message);
    },
  });

  return (
    <>
      {isLoading && isUserLoading && <LoadingDot />}
      {!isLoading && !isUserLoading && showDetailSeatCart?.length === 0 && (
        <div className="flex flex-col gap-y-4">
          {getHalls.sections.map((sec, index) => {
            return (
              <SeatCard key={sec.id} sectionData={sec} prices={prices[index]} />
            );
          })}
        </div>
      )}
      {!isLoading && !isUserLoading && showDetailSeatCart?.length !== 0 && (
        <div className="flex flex-col gap-y-4 bg-neutral-800 px-4 py-6 rounded-three mb-3">
          <div className="flex justify-between items-center">
            <span className=" text-warning-300">Delete All Seat</span>
            <span
              onClick={() => {
                mutation.mutate();
              }}
            >
              <Delete className=" stroke-amber-50 w-3 h-3 hover:stroke-warning-300 transition-all ease-in duration-150 cursor-pointer" />
            </span>
          </div>
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
