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
  return <EventsSection data={Alldata} title="Concert" eventType="concert" />;
};
const ShowItemSction = async () => {
  const Alldata = await getShows();
  return <EventsSection data={Alldata} title="Show" eventType="show" />;
};
const FestivalItemSction = async () => {
  const Alldata = await getFestivals();
  return <EventsSection data={Alldata} title="festival" eventType="festival" />;
};
const SportItemSction = async () => {
  const Alldata = await getSports();
  return <EventsSection data={Alldata} title="sport" eventType="sport" />;
};

const page = async () => {
  return (
    <div className=" relative">
      <div className="light_back animate-pulse" />
      <HeroSection />
      <Suspense fallback={<LoadingDot />}>
        <div className="px-4 lg:px-rl">
          <ConcertItemSction />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <div className="px-4 lg:px-rl">
          <ShowItemSction />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <div className="px-4 lg:px-rl">
          <FestivalItemSction />
        </div>
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <div className="px-4 lg:px-rl">
          <SportItemSction />
        </div>
      </Suspense>
    </div>
  );
};

export default page;
