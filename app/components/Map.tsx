'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

export default function Map() {
  const latLng: [number, number] = [52.0979030011665, 21.03239659105818]

  return (
    <MapContainer center={latLng} zoom={13} className="flex-1">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={latLng} />
    </MapContainer>
  )
}
