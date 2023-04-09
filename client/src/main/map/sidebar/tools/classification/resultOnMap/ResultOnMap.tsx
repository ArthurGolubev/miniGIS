import * as React from "react"
import { ImageOverlay, MapContainer, TileLayer } from "react-leaflet"
import { ChangeMapView } from "./ChangeMapView"

export const ResultOnMap = (
    {data, loading, center}: {
        data: {
            imgUrl: string, coordinates: Array<Array<number>>
        },
        loading: boolean,
        center: Array<number>
    }) => {
    
    return <MapContainer center={[35.88, -5.3525]} zoom={'10'} style={{height: "40vh", width: "100wh"}}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data && !loading && 
            <ImageOverlay
                url={data.imgUrl}
                bounds={data.coordinates.map((point: Array<number>) => [point[1], point[0]])}
                />
            }
        <ChangeMapView coords={center} />
    </MapContainer>
}