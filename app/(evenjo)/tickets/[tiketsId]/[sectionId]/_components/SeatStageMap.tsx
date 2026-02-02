"use client";
import {
  deleteDataFromSupabase,
  submitDataToSupabase,
} from "@/app/lib/actionServer";
import { fakeUserId } from "@/app/lib/fakeUserId";
import { getAllEventSeats } from "@/app/lib/server";
import { Venues } from "@/app/lib/types/event";
import { SeatType } from "@/app/lib/useSeatStor";
import { Line, Seat } from "@/app/Ui/svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

const SeatStageMap = ({
  data,
  type,
  turn,
}: {
  data: Venues;
  type: string;
  turn: string;
}) => {
  const searchParams = useSearchParams();
  const getSeatFilter = searchParams.get("row") || "a";
  const fakeUser = fakeUserId()!;
  const queryClient = useQueryClient();

  const { data: getAllSeatEvent }: { data: SeatType[] | undefined } = useQuery({
    queryKey: ["eventSeats"],
    queryFn: async () => {
      return await getAllEventSeats();
    },
  });

  const mutation = useMutation({
    mutationFn: async (item: SeatType) => {
      console.log("YEs");

      return await submitDataToSupabase(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventSeats"] });
      // alert("اطلاعات با موفقیت در Supabase ذخیره شد!");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteDataFromSupabase(id, fakeUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventSeats"] });
      // alert("اطلاعات با موفقیت از Supabase حذف شد!");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  return (
    <div
      className={` relative mx-auto p-2 `}
      style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
      }}
    >
      <div
        className={`mx-auto ${data.stage?.shape ? "overflow-hidden rounded-t-full" : ""} absolute top-[${data.stage?.y || data.court?.y || 0}px] left-[${data.stage?.x || data.court?.x || 0}px]`}
        style={{
          width: `${data.stage?.width || data.court?.width || 0}px`,
          height: `${data.stage?.height || data.court?.height || 0}px`,
          top: `${data.stage?.y || data.court?.y || 0}px`,
          right: `${data.stage?.x || data.court?.x || 0}px`,
          transform: `translate(${(data.stage?.width || data.court?.width || 0) / 2}px)`,
        }}
      >
        <Line className="z-50" />
        <div className=" light_back  mask-t-from-1 mask-b-from-1" />
      </div>
      {/* <div> */}
      {data.sections.map((set) => {
        return (
          <div key={set.id}>
            {set.seats.map((value) => {
              const serverSeat = getAllSeatEvent?.find(
                (i) => i.seat_id === value.id && i.turn_number === Number(turn),
              );

              const isSold = serverSeat?.status === "sold";
              const isSelectedByMe =
                serverSeat?.status === "selected" &&
                serverSeat?.user_id === fakeUser;
              const isSelectedByOthers =
                serverSeat?.status === "selected" &&
                serverSeat?.user_id !== fakeUser;

              const handleSeatClick = () => {
                if (isSold || isSelectedByOthers) return;

                if (isSelectedByMe) {
                  deleteMutation.mutate(value.id);
                } else {
                  mutation.mutate({
                    event_id: data.id,
                    event_type: type,
                    turn_number: Number(turn),
                    seat_id: value.id,
                    section_id: set.id,
                    row: value.row,
                    number: value.number,
                    status: "selected",
                    price_paid: set.price,
                    user_id: fakeUser,
                  });
                }
                localStorage.setItem(
                  "cart_last_activity",
                  Date.now().toString(),
                );
              };
              return (
                <div
                  onClick={() => handleSeatClick()}
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
                    ${isSold ? "fill-neutral-300 pointer-events-none" : ""}
                    ${!isSold && !isSelectedByMe && !isSelectedByOthers ? "fill-white cursor-pointer" : ""}
                    ${isSelectedByOthers ? "fill-warning-400 pointer-events-none" : ""}
                    ${mutation.isPending || deleteMutation.isPending ? "pointer-events-none opacity-50 animate-pulse" : ""}
                  `}
                  />
                  <div
                    className={`${value.id.includes(getSeatFilter) ? " bg-main blur-xl w-25 h-1 absolute right-4 translate-x-[50%]" : ""}`}
                  />
                  <div className=" overflow-hidden z-5 rounded-two w-fit pointer-events-none absolute -top-[600%] -left-[80%] opacity-0 group-hover:opacity-100">
                    <div className="bg-neutral-700 p-2 flex justify-center">
                      <span className="whitespace-nowrap ">{set.name}</span>
                    </div>
                    <div className="bg-neutral-900 p-2 flex justify-center flex-col items-center gap-y-3">
                      <span className=" text-main text-[22px] font-bold">
                        ${set.price}
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
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      {/* </div> */}
    </div>
  );
};

export default SeatStageMap;
