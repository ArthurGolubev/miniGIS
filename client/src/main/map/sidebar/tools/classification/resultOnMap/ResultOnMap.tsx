import * as React from "react"
import { ImageOverlay, MapContainer, TileLayer } from "react-leaflet"
import { ToastDataWithImgType } from "../../../../types/interfacesTypeScript"
import { LatLngBounds } from "leaflet"
import {CRS} from 'leaflet';


export const ResultOnMap = ({data}: {data: ToastDataWithImgType}) => {
        const coordinates = data.coordinates as any
        console.log('coordinates1 -> ', coordinates)
        const bounds = new LatLngBounds([coordinates[0][1], coordinates[0][0]], [coordinates[1][1], coordinates[1][0]])

        // const bounds = new LatLngBounds([coordinates[0][0], coordinates[0][1]], [coordinates[1][0], coordinates[1][1]])
        // const bounds = new LatLngBounds([coordinates[0][1], coordinates[0][0]], [coordinates[1][1], coordinates[1][0]])
        // const bounds = new LatLngBounds([coordinates[1][0], coordinates[1][1]], [coordinates[0][0], coordinates[0][1]])
        // const bounds = new LatLngBounds([coordinates[0][0], coordinates[0][1]], [coordinates[1][0], coordinates[1][1]])

        return <MapContainer
                attributionControl={false}
                center={[coordinates[0][1], coordinates[0][0]]}
                zoom={'10'} style={{height: "40vh", width: "100wh"}}
                // crs={CRS.EPSG4326}
                >
                <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* <ImageOverlay url={data.img_url} bounds={coordinates.map((point: Array<number>) => [point[1], point[0]] )} /> */}
                <ImageOverlay url={data.img_url} bounds={bounds}/>
        </MapContainer>    
}