"use client";
import LoadingDot from "@/app/components/LoadingDot";
import { useQueryEventSeats } from "@/app/hooks/useQueryEventSeats";
import {
  deleteDataFromSupabase,
  submitDataToSupabase,
} from "@/app/lib/actionServer";
import { fakeUserId } from "@/app/lib/fakeUserId";
import { supabase } from "@/app/lib/supabase";
import { Venues } from "@/app/lib/types/event";
import { SeatType } from "@/app/lib/useSeatStor";
import { Delete, Line, Seat } from "@/app/Ui/svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SeatStageMap = ({
  data,
  type,
  turn,
  eventName,
  eventId,
  prices,
}: {
  data: Venues;
  type: string;
  turn: string;
  eventName: string;
  eventId: string;
  prices: number[];
}) => {
  // const fakeUser = fakeUserId()!;
  const [auth, setAuth] = useState("");
  const [popUp, setPopUp] = useState({
    status: false,
    url: "",
    del: "",
  });
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      setIsUserLoading(true);
      const fakeUser = await fakeUserId();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id && fakeUser === null) {
        setAuth(user?.id);
      } else {
        setAuth(fakeUser!);
      }
      setIsUserLoading(false);
    };
    fetchAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuth(session.user.id);
      } else {
        const fake = localStorage.getItem("guest_session_id");
        setAuth(fake || "");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const searchParams = useSearchParams();
  const getSeatFilter = searchParams.get("row") || "a";

  const queryClient = useQueryClient();

  const [getAllSeatEvent, isLoading] = useQueryEventSeats();

  const mutation = useMutation({
    mutationFn: async (item: SeatType) => {
      return await submitDataToSupabase(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventSeats"] });
      // alert("اطلاعات با موفقیت در Supabase ذخیره شد!");
    },
    onError: (error) => {
      console.log(error.message);

      alert(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await deleteDataFromSupabase(id, auth);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventSeats"] });
      // alert("اطلاعات با موفقیت از Supabase حذف شد!");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handelClosePopUp = () => {
    setPopUp({
      status: false,
      url: "",
      del: "",
    });
  };

  return (
    <div
      className={` relative mx-auto p-2 `}
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      {isLoading && isUserLoading && <LoadingDot />}
      {!isLoading && !isUserLoading && (
        <>
          <div
            className={`mx-auto ${data.stage?.shape ? "overflow-hidden rounded-t-full" : ""} absolute top-[${data.stage?.y || data.court?.y || 0}px] left-[${data.stage?.x || data.court?.x || 0}px]`}
            style={{
              width: `${data.stage?.width || data.court?.width || 0}px`,
              height: `${data.stage?.height || data.court?.height || 0}px`,
              top: `${data.stage?.y || data.court?.y || 0}px`,
              right: `${data.stage?.x || data.court?.x || 0}px`,
              transform: `translate(${(data.stage?.width || data.court?.width || 0) / 2.15}px)`,
            }}
          >
            <Line className="z-50" />
            <div className=" light_back  mask-t-from-1 mask-b-from-1" />
          </div>

          {data.sections.map((set, indexSet) => {
            return (
              <div key={set.id}>
                {set.seats.map((value) => {
                  const serverSeat = getAllSeatEvent?.find(
                    (i) =>
                      i.seat_id === value.id &&
                      i.turn_number === Number(turn) &&
                      i.event_name === eventName &&
                      i.event_id === eventId,
                  );

                  const isSold = serverSeat?.status === "sold";
                  const isSelectedByMe =
                    serverSeat?.status === "selected" &&
                    serverSeat?.user_id === auth;
                  const isPaymentByMe =
                    serverSeat?.status === "payment" &&
                    serverSeat?.user_id === auth;
                  const isSelectedByOthers =
                    (serverSeat?.status === "selected" ||
                      serverSeat?.status === "payment") &&
                    serverSeat?.user_id !== auth;

                  const handleSeatClick = () => {
                    if (isSold || isSelectedByOthers) return;

                    if (isSelectedByMe || isPaymentByMe) {
                      deleteMutation.mutate(serverSeat.id!);
                    } else {
                      const myReservedSeats = getAllSeatEvent?.filter(
                        (val) =>
                          val.user_id === auth &&
                          (val.status === "selected" ||
                            val.status === "payment"),
                      );
                      console.log(myReservedSeats);

                      const hasConflict = myReservedSeats?.some(
                        (seat) =>
                          seat.event_id !== eventId ||
                          seat.turn_number !== Number(turn),
                      );
                      const URLPATH = myReservedSeats?.find(
                        (seat) =>
                          seat.event_id !== eventId ||
                          seat.turn_number !== Number(turn),
                      );
                      if (hasConflict) {
                        setPopUp({
                          status: true,
                          url: `/tickets/${URLPATH?.event_name}_${URLPATH?.event_type}_${URLPATH?.event_id}/section_${URLPATH?.turn_number}`,
                          del: `${URLPATH?.event_type} _ ${URLPATH?.event_name} _ Session ${URLPATH?.turn_number}`,
                        });
                      } else {
                        mutation.mutate({
                          event_id: eventId,
                          event_type: type,
                          turn_number: Number(turn),
                          seat_id: value.id,
                          section_id: set.id,
                          row: value.row,
                          number: value.number,
                          status: "selected",
                          price_paid: prices[indexSet],
                          user_id: auth,
                          event_name: eventName,
                          section_name: set.name,
                        });
                      }
                    }
                  };
                  return (
                    <div
                      onClick={handleSeatClick}
                      key={value.id}
                      className={`w-fit absolute h-fit group`}
                      style={{
                        top: `${value.y}px`,
                        right: `${value.x}px`,
                      }}
                    >
                      <Seat
                        className={` transition-all duration-150 hover:fill-main/60
                    ${isSelectedByMe ? "fill-main" : ""} 
                    ${isPaymentByMe ? "fill-success-400 pointer-events-none" : ""}
                    ${isSold ? "fill-neutral-300 pointer-events-none" : ""}
                    ${!isSold && !isSelectedByMe && !isSelectedByOthers && !isPaymentByMe ? "fill-white cursor-pointer" : ""}
                    ${isSelectedByOthers ? "fill-warning-400 pointer-events-none" : ""}
                    ${mutation.isPending || deleteMutation.isPending ? "pointer-events-none opacity-50 animate-pulse" : ""}
                  `}
                      />
                      <div
                        className={`${value.id.includes(getSeatFilter) ? " bg-main blur-xl w-25 h-1 absolute right-4 translate-x-[50%]" : ""}`}
                      />
                      <div className=" overflow-hidden z-5 rounded-two w-fit pointer-events-none absolute -top-[600%] -translate-x-[42%] translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all ease-in duration-150">
                        <div className="bg-neutral-700 p-2 flex justify-center">
                          <span className="whitespace-nowrap ">{set.name}</span>
                        </div>
                        <div className="bg-neutral-900 p-2 flex justify-center flex-col items-center gap-y-3">
                          <span className=" text-main text-[22px] font-bold">
                            ${prices[indexSet]}
                          </span>
                          <div className="flex justify-between gap-x-3">
                            <span className="whitespace-nowrap text-neutral-200">
                              Row
                              <span className=" text-white text-[20px] font-bold">
                                {" "}
                                {value.row}
                              </span>
                            </span>
                            <span className="w-1 bg-neutral-700 h -1" />
                            <span className="whitespace-nowrap text-neutral-200">
                              Seat
                              <span className=" text-white text-[20px] font-bold">
                                {" "}
                                {value.number}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="h-0 w-fit rounded-two mx-auto border-x-[1em] border-t-[0.7em] border-transparent border-t-neutral-900 -mt-[0.1em] -z-10"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>
      )}
      {popUp.status && (
        <>
          <div
            className=" bg-neutral-900/50 fixed inset-0 cursor-pointer"
            onClick={() => handelClosePopUp()}
          />
          <div className=" fixed py-4 px-8 rounded-two top-10 right-2/4 translate-x-2/4 bg-warning-400">
            <span
              className="flex justify-end mb-4 w-full"
              onClick={() => handelClosePopUp()}
            >
              <Delete className=" stroke-amber-50 hover:stroke-red-300 cursor-pointer transition-all ease-in duration-150" />
            </span>
            <div className=" flex flex-col items-center gap-5">
              <span className=" font-medium text-[20px] text-center">
                You have already selected another event, and reserved a seat in
                that event. You will not be able to select another event until
                you complete or cancel your reservation.
              </span>
              <span className=" text-main font-bold text-center text-[25px]">
                {popUp.del}
              </span>
              <Link
                href={popUp.url}
                className=" bg-warning-300 hover:bg-warning-400 hover:border-warning-300 border transition-all ease-in duration-150 hover:text-warning-300 w-full text-center p-2 rounded-two text-warning-400 font-bold"
              >
                Go To Ticket Event
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SeatStageMap;
