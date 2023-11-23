import {useMap} from 'react-leaflet'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import newSearchParams, {
  useMapInitialization
} from '@/features/Map/MapURLEvents/newSearchParams/newSearchParams'

const getSearchParams = () => new URLSearchParams(window.location.search)

function MapURLEvents() {
  const map = useMap()
  const router = useRouter()

  useMapInitialization(map, getSearchParams())

  useEffect(() => {
    const updateUrl = () => {
      const {lat, lng} = map.getCenter()
      const zoom = map.getZoom()

      const queryString = new URLSearchParams(
        newSearchParams(lat, lng, zoom, Array.from(getSearchParams().entries()))
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

export default MapURLEvents
