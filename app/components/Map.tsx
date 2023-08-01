"use client"

import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import "leaflet-defaulticon-compatibility"
import { MapContainer, Marker, TileLayer } from "react-leaflet"

export default function Map() {
  const lat = 52.097903001166504
  const lng = 21.03239659105818

  return (
    <MapContainer center={[lat, lng]} zoom={13} className="flex-1">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  )
}
