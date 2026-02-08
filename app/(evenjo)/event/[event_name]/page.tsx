import { getCustomEvent } from "@/app/lib/server";
import { notFound } from "next/navigation";
// import FitringEvent from "./_components/FitringEvent";
import EventList from "./_components/EventList";

const page = async ({
  params,
}: {
  params: Promise<{ event_name: string }>;
}) => {
  const { event_name } = await params;
  const [data, count] = await getCustomEvent(`${event_name}`, 1);

  if (
    data.length === 0 ||
    event_name === "event_seats" ||
    event_name === "venues"
  ) {
    return notFound();
  }

  return (
    <div>
      {/* <FitringEvent /> */}
      <EventList data={data} count={count} type={event_name} />
    </div>
  );
};

export default page;
