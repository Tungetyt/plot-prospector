import { useMap } from 'react-leaflet'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { MapOptions } from 'leaflet'
import { Point } from '@/store/draftPlot/common'

type Lng = keyof Pick<Point, 'lng'>
type Lat = keyof Pick<Point, 'lat'>
type Zoom = keyof Pick<MapOptions, 'zoom'>

export const urlParams = {
  lat: 'lat',
  lng: 'lng',
  zoom: 'zoom',
} as const satisfies Readonly<
  Record<Lng, Lng> & Record<Lat, Lat> & Record<Zoom, Zoom>
>

const useMapInitialization = (
  map: ReturnType<typeof useMap>,
  searchParams: URLSearchParams,
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

const getSearchParams = () => new URLSearchParams(window.location.search)

export const newSearchParams = (
  lat: number,
  lng: number,
  zoom: number,
  searchParams: [string, string][],
): Record<string, string> => ({
  ...searchParams.reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}),
  [urlParams.lat]: lat.toString(),
  [urlParams.lng]: lng.toString(),
  [urlParams.zoom]: zoom.toString(),
})

function MapEvents() {
  const map = useMap()
  const router = useRouter()

  useMapInitialization(map, getSearchParams())

  useEffect(() => {
    const updateUrl = () => {
      const { lng, lat } = map.getCenter()
      const zoom = map.getZoom()

      // const queryString = new URLSearchParams({
      //   ...Array.from(getSearchParams().entries()).reduce(
      //     (obj, [key, val]) => ({ ...obj, [key]: val }),
      //     {},
      //   ),
      //   [urlParams.lat]: lat.toString(),
      //   [urlParams.lng]: lng.toString(),
      //   [urlParams.zoom]: zoom.toString(),
      // }).toString()
      const queryString = new URLSearchParams(
        newSearchParams(
          lat,
          lng,
          zoom,
          Array.from(getSearchParams().entries()),
        ),
      ).toString()

      const newPath = `${window.location.pathname}?${queryString}`

      router.push(newPath)
    }

    map.on('moveend', updateUrl)

    return () => {
      map.off('moveend', updateUrl)
    }
  }, [map, router])

  return null
}

export default MapEvents
