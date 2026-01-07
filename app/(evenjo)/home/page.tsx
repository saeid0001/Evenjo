import HeroSection from "@/app/(evenjo)/home/_components/HeroSection";
import LoadingDot from "@/app/components/LoadingDot";
import {
  getConcerts,
  getFestivals,
  getShows,
  getSports,
} from "@/app/lib/server";
import { Suspense } from "react";
import EventsSection from "./_components/EventsSection";

const ConcertItemSction = async () => {
  const Alldata = await getConcerts();
  console.log(Alldata);
  return <EventsSection data={Alldata} title="Concert" eventType="concert" />;
};
const ShowItemSction = async () => {
  const Alldata = await getShows();
  console.log(Alldata);
  return <EventsSection data={Alldata} title="Show" eventType="show" />;
};
const FestivalItemSction = async () => {
  const Alldata = await getFestivals();
  console.log(Alldata);
  return <EventsSection data={Alldata} title="festival" eventType="festival" />;
};
const SportItemSction = async () => {
  const Alldata = await getSports();
  console.log(Alldata);
  return <EventsSection data={Alldata} title="sport" eventType="sport" />;
};

const page = async () => {
  return (
    <div className=" relative">
      <div className="light_back" />
      <HeroSection />
      <Suspense fallback={<LoadingDot />}>
        <div className="px-rl">
          <ConcertItemSction />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <div className="px-rl">
          <ShowItemSction />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <div className="px-rl">
          <FestivalItemSction />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <div className="px-rl">
          <SportItemSction />
        </div>
      </Suspense>
    </div>
  );
};

export default page;
