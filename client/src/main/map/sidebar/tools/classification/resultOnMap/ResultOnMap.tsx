import * as React from "react"
import { ImageOverlay, MapContainer, TileLayer } from "react-leaflet"
import { ToastDataWithImgType } from "../../../../types/interfacesTypeScript"

export const ResultOnMap = ({data}: {data: ToastDataWithImgType}) => {
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