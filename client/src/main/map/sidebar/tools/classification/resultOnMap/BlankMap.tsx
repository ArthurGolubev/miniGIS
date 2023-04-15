import * as React from "react"
import { MapContainer, TileLayer } from "react-leaflet"

export const BlankMap = () => {
    return <MapContainer center={[35.88, -5.3525]} zoom={'10'} style={{height: "40vh", width: "100wh"}}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
    </MapContainer>    
}