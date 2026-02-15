"use client";

import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; 

const Map = ({
  lat,
  lon,
  name,
}: {
  lat: number;
  lon: number;
  name: string;
}) => {
  const customIcon = new L.Icon({
    iconUrl: "/locationicon5.png", 
    iconSize: [80, 80],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
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
