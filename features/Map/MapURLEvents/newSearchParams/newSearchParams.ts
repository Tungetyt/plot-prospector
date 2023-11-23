import {Point} from '@/store/draftPlot/common'
import {MapOptions} from 'leaflet'
import {useEffect, useRef} from 'react'
import {useMap} from 'react-leaflet/hooks'

type Lat = keyof Pick<Point, 'lat'>
type Lng = keyof Pick<Point, 'lng'>
type Zoom = keyof Pick<MapOptions, 'zoom'>
export const urlParams = {
  lat: 'lat',
  lng: 'lng',
  zoom: 'zoom'
} as const satisfies Readonly<
  Record<Lng, Lng> & Record<Lat, Lat> & Record<Zoom, Zoom>
>
export const useMapInitialization = (
  map: ReturnType<typeof useMap>,
  searchParams: URLSearchParams
) => {
  const mapInitialized = useRef(false)

  useEffect(() => {
    if (mapInitialized.current) return

    mapInitialized.current = true

    const lat = searchParams.get(urlParams.lat)
    const lng = searchParams.get(urlParams.lng)
    const zoom = searchParams.get(urlParams.zoom)

    if (!lat || !lng || !zoom) return

    map.setView([parseFloat(lat), parseFloat(lng)], parseInt(zoom, 10))
  }, [searchParams, map])
}
const newSearchParams = (
  lat: number,
  lng: number,
  zoom: number,
  searchParams: ReadonlyArray<[string, string]>
): Record<string, string> => ({
  ...searchParams.reduce((obj, [key, val]) => ({...obj, [key]: val}), {}),
  [urlParams.lat]: lat.toString(),
  [urlParams.lng]: lng.toString(),
  [urlParams.zoom]: zoom.toString()
})

export default newSearchParams
