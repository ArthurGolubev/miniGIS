import * as React from "react"
import { useMap } from "react-leaflet"
import * as L from 'leaflet'
import { d1 } from "./rv"

export const TTT = (): void => {
    const map = useMap()

    var fg = L.featureGroup();
        map.eachLayer((layer)=>{
        if(layer instanceof L.Path || layer instanceof L.Marker){
            console.log('111 -> ', layer)
            fg.addLayer(layer)
        }
    })
    
    console.log('p -> ', fg.getLayers())
    d1(fg.toGeoJSON())
    return null

}