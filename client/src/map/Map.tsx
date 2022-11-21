import * as React from 'react'
import * as L from 'leaflet'
import { Sidebar } from './sidebar/Sidebar'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { layers, mapObj, searchImages, tools } from './rv'
import { Shape } from './types/newTypes'


export const Map = () => {

    const parsGeom = (geom: any) => {
        console.log(geom)
        console.log('Event ->', geom.type)
        
        let id: string
        switch (geom.type) {
            case 'pm:create':
                console.log('case 1')
                id = geom.layer._leaflet_id
                geom.layer.on('pm:edit', (geom: any) => parsGeom(geom))
                break
            case 'pm:edit':
                id = geom.layer._leaflet_id
                geom.layer.setStyle({color: "#ff00ff"})
                break
            case 'pm:cut':
                console.log('case 2')
                id = geom.originalLayer._leaflet_id
                break
            default:
                console.log('case Default')
                break
        }
        let layer = geom.layer
        geom = geom.layer.toGeoJSON()
        console.log('Geometry ->', geom.geometry.type)

        let data: Shape | undefined = undefined
        switch (geom.geometry.type) {
            case "Point":
                if(tools().setPOI){
                    searchImages({...searchImages(), poi: geom.geometry.coordinates})
                    tools({...tools(), setPOI: false})
                } else {
                    data = {
                        layerType: 'shape',
                        type: 'Точка',
                        outer_vertex: 1,
                        geom: geom,
                        layer: layer,
                        positionInTable: Object.keys(layers()).length +1,
                    }
                }
                break;
            case "LineString":
                data = {
                    layerType: 'shape',
                    type: 'Полилиния',
                    outer_vertex: geom.geometry.coordinates.length,
                    geom: geom,
                    layer: layer,
                    positionInTable: Object.keys(layers()).length +1
                }
                break;
            case "Polygon":
                data = {
                    layerType: 'shape',
                    type: 'Полигон',
                    outer_vertex: geom.geometry.coordinates[0].length -1,
                    inner_vertex: geom.geometry.coordinates[1] ? geom.geometry.coordinates[0].length -1 : undefined,
                    geom: geom,
                    layer: layer,
                    positionInTable: Object.keys(layers()).length +1
                }
                break;
            default:
                console.log('DEFAULT case from Map.tsx')
            }
            if(data != undefined) layers({ ...layers(), [id]: data })
    }


    React.useEffect(() => {
        let map: any = L.map('map').setView([51.505, -0.09], 13)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)
        map.pm.addControls({  
            position: 'topleft',
            drawCircleMarker: false,
            drawRectangle: false,
            drawCircle: false,  
        })
        map.pm.setPathOptions(
            { color: 'orange' },
        );

        map.on('pm:create', (geom: any) => parsGeom(geom))
        map.on('pm:cut', (geom: any) => parsGeom(geom))
        mapObj(map)
        
    })



    return <div className='row justify-content-center g-0'>
        <div className='col-9'>
            <div id='map' style={{height: '945px', width: '100%'}}></div>
        </div>
        <div className='col'>
            <Sidebar />
        </div>
    </div>
}