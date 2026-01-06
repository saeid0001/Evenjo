"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // اضافه کردن leaflet برای استفاده از آیکون
import { strict } from "assert";

const Map = ({
  lat,
  lon,
  name,
}: {
  lat: number;
  lon: number;
  name: string;
}) => {
  // آیکون شخصی رو می‌سازیم
  const customIcon = new L.Icon({
    iconUrl: "/locationicon5.png", // مسیر آیکون شما
    iconSize: [80, 80], // اندازه آیکون
    iconAnchor: [16, 32], // نقطه‌ای که باید موقعیت مارکر در نظر گرفته بشه
    popupAnchor: [0, -32], // موقعیت پنجره پاپ آپ نسبت به آیکون
  });

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      zoomControl={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p1dHRybDR5MGJuZjQzcGhrZ2doeGgwNyJ9.a-vxW4UaxOoUMWUTGnEArw#12/40.77169/-73.90584"
        // attribution=""
      />
      <Marker position={[lat, lon]} icon={customIcon}>
        <Tooltip permanent direction="bottom" offset={[30, 30]}>
          {name}
        </Tooltip>
      </Marker>
    </MapContainer>
  );
};

export default Map;
