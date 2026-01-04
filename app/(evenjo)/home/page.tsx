import HeroSection from "@/app/(evenjo)/home/_components/HeroSection";
import LoadingDot from "@/app/components/LoadingDot";
import {
  getConcerts,
  getFestivals,
  getShows,
  getSports,
} from "@/app/lib/server";
import { Suspense } from "react";
import ConcertSection from "./_components/sections/ConcertSection";
import ShowSection from "./_components/sections/ShowSection";
import SportSection from "./_components/sections/SportSection";
import FestivalSection from "./_components/sections/FestivalSection";

const ConcertItemSction = async () => {
  const Alldata = await getConcerts();
  return <ConcertSection data={Alldata} title="Concert" />;
};
const ShowItemSction = async () => {
  const Alldata = await getShows();
  return <ShowSection data={Alldata} title="Show" />;
};
const SportItemSction = async () => {
  const Alldata = await getSports();
  return <SportSection data={Alldata} title="Sport" />;
};
const FestivalItemSction = async () => {
  const Alldata = await getFestivals();
  return <FestivalSection data={Alldata} title="Festival" />;
};

const page = async () => {
  return (
    <div className=" relative">
      <div className="light_back" />
      <HeroSection />
      <Suspense fallback={<LoadingDot />}>
        <ConcertItemSction />
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <ShowItemSction />
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <SportItemSction />
      </Suspense>
      <Suspense fallback={<LoadingDot />}>
        <FestivalItemSction />
      </Suspense>
    </div>
  );
};

export default page;
