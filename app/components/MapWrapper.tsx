"use client";

import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-neutral-800 animate-pulse" />
});

export default function MapWrapper({ lat, lon, name }: { lat: number; lon: number; name: string }) {
  return <DynamicMap lat={lat} lon={lon} name={name} />;
}