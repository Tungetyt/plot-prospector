import { useMap } from 'react-leaflet'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { MapOptions } from 'leaflet'
import { Point } from '@/app/store/draftPlot/common'

type Lng = keyof Pick<Point, 'lng'>
type Lat = keyof Pick<Point, 'lat'>
type Zoom = keyof Pick<MapOptions, 'zoom'>

const urlParams = {
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

    map.setView(
      [parseFloat(lat as string), parseFloat(lng as string)],
      parseInt(zoom as string, 10),
    )
  }, [searchParams, map])
}

const searchParams = () => new URLSearchParams(window.location.search)

function MapEvents() {
  const map = useMap()
  const router = useRouter()

  useMapInitialization(map, searchParams())

  useEffect(() => {
    const updateUrl = () => {
      const { lng, lat } = map.getCenter()
      const zoom = map.getZoom()

      const queryString = new URLSearchParams({
        ...Array.from(searchParams().entries()).reduce(
          (obj, [key, val]) => ({ ...obj, [key]: val }),
          {},
        ),
        [urlParams.lat]: lat.toString(),
        [urlParams.lng]: lng.toString(),
        [urlParams.zoom]: zoom.toString(),
      }).toString()

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
