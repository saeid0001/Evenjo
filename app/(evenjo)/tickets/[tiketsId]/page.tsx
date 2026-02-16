import { getItemById } from "@/app/lib/server";
import {
  getEventDate,
  getEventImage,
  getEventName,
} from "@/app/lib/types/event";
import { Location } from "@/app/Ui/svg";
import Image from "next/image";
import TimeCardTicket from "../_components/TimeCardTicket";
import Map from "@/app/components/Map";
import EventsSection from "../../home/_components/EventsSection";

const page = async ({ params }: { params: Promise<{ tiketsId: string }> }) => {
  const { tiketsId } = await params;
  const [, performance, idNumber] = tiketsId.split("_");
  const { data: tiketsData } = await getItemById(
    `${performance}_${idNumber}`,
    performance,
  );

  const eventImage = getEventImage(tiketsData);
  const eventName = getEventName(tiketsData);
  const eventData = getEventDate(tiketsData);

  const hallsPerfo = [...new Set(tiketsData.turn.map((val) => val.halls))];
  const lcationGo = tiketsData.location.geographicallocation;

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
        <div className="px-rl py-12 lg:py-25 flex flex-col items-left justify-center">
          <h1 className="max-w-3xl text-[200%] md:text-[400%] lg:text-[500%] text-left font-bold leading-tight">
            {eventName}
          </h1>
          <span className="max-w-lg mt-4 text-sm md:text-base">
            {tiketsData.description}
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 px-8 lg:px-rl gap-8 lg:gap-4">
        <div className="order-2 lg:order-1 lg:col-span-9 w-full py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span className="text-[20px] md:text-[28px] font-bold">
              All days and times
            </span>

            <div className="flex items-center gap-4">
              <Location className="fill-white shrink-0" />
              <div className="relative inline-block w-full md:w-auto">
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-white pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>

                <select className="appearance-none pr-12 pl-4 py-2 rounded-lg focus:outline-none cursor-pointer min-w-50">
                  {hallsPerfo.map((info, index) => (
                    <option
                      value={info}
                      key={`${info}_${index}`}
                      className=" checked:bg-tint-200"
                    >
                      {info}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-neutral-600 w-full h-0.5 mt-4 mb-6" />

          <div className="flex flex-col gap-y-4">
            {tiketsData.turn.map((turnsItem) => (
              <TimeCardTicket
                key={turnsItem.clock}
                turnsItem={turnsItem}
                eventData={eventData}
                path={`${tiketsId}`}
              />
            ))}
          </div>

          <div className="mt-12">
            <EventsSection
              title={performance}
              eventType={performance}
              idPerform={`${performance}_${idNumber}`}
            />
          </div>
        </div>

        <div className="order-1 lg:order-2 h-fit w-full lg:col-span-3 lg:sticky lg:top-25 lg:-translate-y-20">
          <div className="relative w-full h-64 hidden lg:block md:h-80 lg:h-100">
            <Image
              src={eventImage[0]}
              alt={eventName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover rounded-three overflow-hidden shadow-2xl"
              priority
            />
          </div>
          <div className="w-full h-48 lg:h-37.5 mt-6 rounded-three overflow-hidden border border-neutral-700">
            <Map
              lat={lcationGo[0]}
              lon={lcationGo[1]}
              name={tiketsData.location.name}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
