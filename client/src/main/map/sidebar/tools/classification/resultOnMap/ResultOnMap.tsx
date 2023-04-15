import * as React from "react"
import {CRS} from 'leaflet'
import { ImageOverlay, MapContainer, TileLayer } from "react-leaflet"

export const ResultOnMap = ({data}: {
        data: {
            img_url: string, coordinates: Array<Array<number>>
        },
    }) => {
        const coordinates = data.coordinates as any
        console.log('coordinates -> ', coordinates)

        return <MapContainer
            center={[coordinates[0][1], coordinates[0][0]]}
            zoom={'10'} style={{height: "40vh", width: "100wh"}}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                
                />
                <ImageOverlay url={data.img_url} bounds={coordinates.map((point: Array<number>) => [point[1], point[0]] )} />
        </MapContainer>    
}