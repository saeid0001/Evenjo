import { getItemById, getVenuesByID } from "@/app/lib/server";
import React from "react";
import {
  getEventDate,
  getEventImage,
  getEventName,
} from "@/app/lib/types/event";
import {
  Calendar,
  Clock,
  Like,
  Location,
  Seat,
  Share,
  Ticket,
} from "@/app/Ui/svg";
import concertDate from "@/app/lib/concertDate";
import SeatStageMap from "./_components/SeatStageMap";
import { LittleInfoSeat } from "./_components/LittleInfoSeat";
import SelectionManagerSeat from "./_components/SelectionManagerSeat";

const page = async ({
  params,
}: {
  params: Promise<{ sectionId: string; tiketsId: string }>;
}) => {
  const { tiketsId, sectionId } = await params;
  const [, performance, idNumber] = tiketsId.split("_");
  const [, turnnumbreId] = sectionId.split("_");
  const { data: tiketsData } = await getItemById(
    `${performance}_${idNumber}`,
    performance,
  );
  const getSection = tiketsData.turn.filter(
    (val) => val.turnnumbre === Number(turnnumbreId),
  );

  const nameHalls = getSection[0].halls.replaceAll(" ", "-");

  const getHalls = await getVenuesByID(nameHalls);

  const eventImage = getEventImage(tiketsData);
  const eventName = getEventName(tiketsData);
  const eventDate = getEventDate(tiketsData);

  const [year, month, day] = concertDate(eventDate);
  const oClock = `${getSection[0].clock}
                  - 
                  ${`${+getSection[0].clock.slice(0, 2) + 2}:00`}
                  ${+getSection[0].clock.slice(0, 2) + 2 >= 12 ? " PM" : " AM"}`;

  return (
    <>
      <div className="relative h-auto">
        <div
          className="absolute -translate-y-18 inset-0 mask-t-from-80% mask-b-from-50% -z-20 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${eventImage[0]})`,
          }}
        />
        <div
          className={`w-[60%] px-rl py-25 flex ml-auto flex-col items-left justify-center`}
        >
          <div className="w-full flex justify-between items-center mb-8">
            <span className=" text-[48px] font-bold tracking-widest">
              {eventName.toUpperCase()}
            </span>
            <div className="flex gap-4 items-center">
              <Like />
              <Share />
            </div>
          </div>
          <div className=" w-full flex justify-between items-center">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5.25 h-5.25" />
                <span className=" text-[18px] text-neutral-100">
                  {`${month} ${day} - ${year}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Location className="w-5.25 h-5.25" />
                <span className="capitalize text-[18px] text-neutral-100">
                  {getSection[0].halls}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5.25 h-5.25" />
                <span className=" text-[18px] text-neutral-100">{oClock}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-5.25 h-5.25 fill-neutral-200" />
                <span className=" text-[18px] text-neutral-100">
                  From{" "}
                  <span className="capitalize text-white font-bold">
                    {Math.min(...getSection[0].price)}
                  </span>{" "}
                  $/Person
                </span>
              </div>
            </div>
          </div>
          <LittleInfoSeat />
        </div>
      </div>
      <div className=" grid grid-cols-12 gap-6 px-rl">
        <div className=" col-span-8 w-full h-fit px-4 ">
          <div className="w-full overflow-x-auto overflow-y-visible px-20 -mx-0 pt-40 -mt-40 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-[10px]">
            <SeatStageMap
              data={getHalls}
              type={performance}
              turn={turnnumbreId}
              eventName={eventName}
              eventId={idNumber}
              prices={getSection[0].price}
            />
          </div>
          <div className=" my-8 px-6 py-3 rounded-three bg-neutral-1000 w-full flex justify-between items-center">
            <div className="flex items-center gap-x-4">
              <Seat className=" fill-white" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-x-4">
              <Seat className=" fill-neutral-300" />
              <span>Sold</span>
            </div>
            <div className="flex items-center gap-x-4">
              <Seat className=" fill-main" />
              <span>You Selected</span>
            </div>
            <div className="flex items-center gap-x-4">
              <Seat className=" fill-success-400" />
              <span>You Payment</span>
            </div>
            <div className="flex items-center gap-x-4">
              <Seat className="  fill-warning-400" />
              <span>Pending</span>
            </div>
          </div>
        </div>
        <div className="col-span-4 px-1 w-full h-screen overflow-y-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-[10px]">
          <SelectionManagerSeat
            getHalls={getHalls}
            type={performance}
            turn={turnnumbreId}
            eventName={eventName}
            eventId={idNumber}
            clock={oClock}
            date={{
              year,
              month,
              day,
            }}
            prices={getSection[0].price}
          />
        </div>
      </div>
    </>
  );
};

export default page;
