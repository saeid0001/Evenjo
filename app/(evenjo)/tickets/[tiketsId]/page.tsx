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
  const [_, performance, idNumber] = tiketsId.split("_");
  const { data: tiketsData } = await getItemById(
    `${performance}_${idNumber}`,
    performance
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
          className="absolute inset-0 mask-t-from-80% mask-b-from-50% -z-20 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${eventImage[0]})`,
            top: "-30%",
          }}
        />
        <div
          style={{
            paddingTop: "100px",
            paddingBottom: "100px",
          }}
          className={`px-rl flex flex-col items-left justify-center`}
        >
          <h1 className=" max-w-3xl text-[500%] text-left font-bold">
            {eventName}
          </h1>
          <span className="max-w-lg">{tiketsData.description}</span>
        </div>
      </div>
      <div className="grid grid-cols-12 px-rl gap-4">
        <div className=" col-span-9 w-full py-4">
          <div className="flex justify-between text-[28px] font-bold">
            <span>All days and times</span>
            <div className="flex items-center gap-4">
              <Location className=" fill-white" />
              <div className="relative inline-block">
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

                <select
                  className="appearance-none pr-12 pl-4 py-2  
                  rounded-lg focus:outline-none
                  cursor-pointer min-w-50"
                >
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
          <div className=" bg-neutral-600 w-full mt-2 mb-4" />
          {tiketsData.turn.map((turnsItem) => {
            return (
              <TimeCardTicket
                key={turnsItem.clock}
                turnsItem={turnsItem}
                eventData={eventData}
              />
            );
          })}
          <EventsSection title={performance} eventType={performance} idPerform={`${performance}_${idNumber}`}/>
        </div>

        <div className=" h-fit w-full col-span-3 sticky top-25 -translate-y-20 text-transparent ">
          <Image
            src={eventImage[1]}
            alt={eventName}
            width={500}
            height={500}
            className=" object-cover w-full h-100 rounded-three overflow-hidden"
          />
          <div className=" w-full h-37.5 mt-6 rounded-three overflow-hidden border">
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
