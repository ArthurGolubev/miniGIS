import { useMap } from 'react-leaflet';

export const ChangeMapView = ({ coords }: {coords: Array<number>}): null => {
    const map = useMap()
    map.setView(coords as any, map.getZoom())
    return null
}