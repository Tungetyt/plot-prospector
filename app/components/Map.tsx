/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  Popup,
  Rectangle,
  TileLayer,
} from 'react-leaflet'

type Point = [number, number]

const center: Point = [51.505, -0.09]
//[52.0979030011665, 21.03239659105818]

const polyline: Point[] = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12],
]

const multiPolyline: Point[][] = [
  [
    [51.5, -0.1],
    [51.5, -0.12],
    [51.52, -0.12],
  ],
  [
    [51.5, -0.05],
    [51.5, -0.06],
    [51.52, -0.06],
  ],
]

const polygon: {
  points: Point[]
  id: string
} = {
  id: 'abc',
  points: [
    [51.515599, -0.09],
    [51.52, -0.1],
    [51.52, -0.12],
  ],
}

const multiPolygon: Point[][] = [
  [
    [51.51, -0.12],
    [51.51, -0.13],
    [51.53, -0.13],
  ],
  [
    [51.51, -0.05],
    [51.51, -0.07],
    [51.53, -0.07],
  ],
]

const rectangle: Point[] = [
  [51.49, -0.08],
  [51.5, -0.06],
]

const fillBlueOptions = { fillColor: 'blue' }
const blackOptions = { color: 'black' }
const limeOptions = { color: 'lime' }
const purpleOptions = { color: 'purple' }
const yellowOptions = { color: 'yellow' }
const orangeOptions = { color: 'orange' }
const redOptions = { color: 'red' }

export default function Map() {
  return (
    <MapContainer
      center={center}
      zoom={13}
      className="flex-1"
      attributionControl={false}
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {/*<Marker position={center} />*/}
      {/*<Circle center={center} pathOptions={fillBlueOptions} radius={200} />*/}
      {/*<CircleMarker*/}
      {/*  center={[51.51, -0.12]}*/}
      {/*  pathOptions={redOptions}*/}
      {/*  radius={20}*/}
      {/*>*/}
      {/*  <Popup>Popup in CircleMarker</Popup>*/}
      {/*</CircleMarker>*/}
      {/*<Polyline pathOptions={limeOptions} positions={polyline} />*/}
      {/*<Polyline pathOptions={orangeOptions} positions={multiPolyline} />*/}
      <Polygon
        pathOptions={purpleOptions}
        positions={polygon.points}
        eventHandlers={{
          add: (e) => {
            const layer = e.target
            // Directly manipulate the DOM to set a custom data attribute
            layer._path.setAttribute('data-id', polygon.id)
          },
          // mouseover: (e) => {
          //   console.log(e);
          //   const layer = e.target;
          //   layer.setStyle({
          //     color: "black",
          //     fillColor: "black"
          //   });
          // },
          click: (e) => {
            // Access the custom data attribute from the SVG element
            const id = e.target._path.getAttribute('data-id')
            console.log('Polygon with id: ', id, ' clicked')
          },
        }}
      />
      {/*<Polygon pathOptions={yellowOptions} positions={multiPolygon} />*/}
      {/*<Rectangle bounds={rectangle} pathOptions={blackOptions} />*/}
    </MapContainer>
  )
}
