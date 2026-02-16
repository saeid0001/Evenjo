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
  turn: {
    turn: string;
    clock: string;
    date: string;
  };
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
                      i.turn_number === Number(turn.turn) &&
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

                      const hasConflict = myReservedSeats?.some(
                        (seat) =>
                          seat.event_id !== eventId ||
                          seat.turn_number !== Number(turn.turn),
                      );
                      const URLPATH = myReservedSeats?.find(
                        (seat) =>
                          seat.event_id !== eventId ||
                          seat.turn_number !== Number(turn.turn),
                      );
                      if (hasConflict) {
                        setPopUp({
                          status: true,
                          url: `/tickets/${URLPATH?.event_name}_${URLPATH?.event_type}_${URLPATH?.event_id}/section_${URLPATH?.turn_number}`,
                          del: `${URLPATH?.event_type} , ${URLPATH?.event_name} , Session ${URLPATH?.turn_number}`,
                        });
                      } else {
                        mutation.mutate({
                          event_id: eventId,
                          event_type: type,
                          turn_number: Number(turn.turn),
                          seat_id: value.id,
                          section_id: set.id,
                          row: value.row,
                          number: value.number,
                          status: "selected",
                          price_paid: prices[indexSet],
                          user_id: auth,
                          event_name: eventName,
                          section_name: set.name,
                          clock: turn.clock,
                          date: turn.date,
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
            className="bg-black/60 backdrop-blur-sm fixed inset-0 z-[100] cursor-pointer"
            onClick={() => handelClosePopUp()}
          />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[500px] z-[101] bg-neutral-800 border border-neutral-700 p-6 md:p-8 rounded-three shadow-2xl animate-in fade-in zoom-in duration-300">
            <div
              onClick={() => handelClosePopUp()}
              className="flex justify-end absolute top-4 right-4"
            >
              <Delete className="stroke-neutral-400 hover:stroke-red-500 cursor-pointer transition-colors" />
            </div>

            <div className="flex flex-col items-center gap-y-6 mt-4">
              <div className="w-16 h-16 rounded-full bg-main/10 flex items-center justify-center">
                <span className="text-main text-3xl font-bold">!</span>
              </div>

              <span className="font-medium text-[16px] md:text-[18px] text-neutral-100 text-center leading-relaxed">
                You have already selected another event and reserved a seat. You
                cannot select a new event until you complete or cancel your
                current reservation.
              </span>

              <span className="text-main capitalize font-bold text-center text-[20px] md:text-[24px] px-4 py-2 bg-main/5 rounded-lg border border-main/10 w-full">
                {popUp.del}
              </span>

              <Link
                href={popUp.url}
                className="bg-main hover:bg-main/90 active:scale-[0.98] text-white w-full text-center py-3.5 rounded-two font-bold transition-all shadow-lg shadow-main/20"
              >
                Go To Ticket Event
              </Link>

              <button
                onClick={() => handelClosePopUp()}
                className="text-neutral-400 text-sm font-medium hover:text-white transition-colors md:hidden"
              >
                Dismiss
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SeatStageMap;
