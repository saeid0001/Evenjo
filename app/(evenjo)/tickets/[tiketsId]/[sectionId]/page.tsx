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
          className="absolute inset-0 mask-t-from-80% mask-b-from-50% -z-20 bg-cover bg-no-repeat opacity-50 lg:opacity-100"
          style={{
            backgroundImage: `url(${eventImage[1]})`,
            top: "-30%",
          }}
        />
        <div className="w-full lg:w-[60%] px-8 lg:px-rl py-12 lg:py-25 flex lg:ml-auto flex-col justify-center">
          <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-center mb-8 gap-y-4">
            <span className="text-[28px] md:text-[40px] lg:text-[48px] font-bold tracking-widest leading-tight">
              {eventName.toUpperCase()}
            </span>
            <div className="flex gap-4 items-center self-end sm:self-auto">
              <Like />
              <Share />
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-6">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5.25 h-5.25 text-tint-400 fill-neutral-200" />
                <span className="text-sm md:text-[18px] text-neutral-100">
                  {`${month} ${day} - ${year}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Location className="w-5.25 h-5.25 text-tint-400" />
                <span className="capitalize text-sm md:text-[18px] text-neutral-100">
                  {getSection[0].halls}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5.25 h-5.25 text-tint-400" />
                <span className="text-sm md:text-[18px] text-neutral-100">
                  {oClock}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Ticket className="w-5.25 h-5.25 fill-neutral-200" />
                <span className="text-sm md:text-[18px] text-neutral-100">
                  From{" "}
                  <span className="capitalize text-white font-bold">
                    {Math.min(...getSection[0].price)}
                  </span>{" "}
                  $/Person
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <LittleInfoSeat />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 px-8 lg:px-rl pb-20">
        <div className="lg:col-span-8 w-full h-fit">
          <div className="w-full overflow-x-auto overflow-y-visible px-4 md:px-20 pt-10 lg:pt-40 lg:-mt-40 no-scrollbar lg:custom-scrollbar">
            <div className="min-w-150 lg:min-w-full">
              <SeatStageMap
                data={getHalls}
                type={performance}
                turn={{
                  turn: turnnumbreId,
                  clock: getSection[0].clock,
                  date: eventDate,
                }}
                eventName={eventName}
                eventId={idNumber}
                prices={getSection[0].price}
              />
            </div>
          </div>

          <div className="my-8 px-4 py-4 rounded-three bg-neutral-1000 w-full flex flex-wrap lg:flex-nowrap justify-center lg:justify-between items-center gap-4">
            {[
              { icon: <Seat className="fill-white" />, label: "Available" },
              { icon: <Seat className="fill-neutral-300" />, label: "Sold" },
              { icon: <Seat className="fill-main" />, label: "Selected" },
              { icon: <Seat className="fill-success-400" />, label: "Paid" },
              { icon: <Seat className="fill-warning-400" />, label: "Pending" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-x-2 min-w-fit">
                {item.icon}
                <span className="text-xs md:text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 w-full h-auto lg:h-screen lg:overflow-y-auto lg:sticky lg:top-0">
          <SelectionManagerSeat
            getHalls={getHalls}
            type={performance}
            turn={turnnumbreId}
            eventName={eventName}
            eventId={idNumber}
            clock={oClock}
            date={{ year, month, day }}
            prices={getSection[0].price}
          />
        </div>
      </div>
    </>
  );
};

export default page;
