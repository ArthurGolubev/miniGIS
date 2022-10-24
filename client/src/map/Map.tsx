import * as React from 'react'
import * as L from 'leaflet'
import { Sidebar } from './Sidebar'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { mapData } from './rv'


export const Map = () => {

    const parsGeom = (geom: any) => {
        console.log(geom)
        console.log('Event ->', geom.type)
        let id: string
        switch (geom.type) {
            case 'pm:create' || 'pm:edit':
                console.log('case 1')
                id = geom.layer._leaflet_id
                break
            case 'pm:cut':
                console.log('case 2')
                id = geom.originalLayer._leaflet_id
                break
            default:
                console.log('case Default')
                break
        }
        geom = geom.layer.toGeoJSON()
        console.log('Geometry ->', geom.geometry.type)
        switch (geom.geometry.type) {
            case "Point":
                mapData({...mapData(),
                    [id]: {
                        shape: 'Точка',
                        outer_vertex: 1,
                        text: ''
                    }
                })
                break;
            case "LineString":
                mapData({...mapData(),
                    [id]: {
                        shape: 'Полилиния',
                        outer_vertex: geom.geometry.coordinates.length,
                        text: ''
                    }
                })
                break;
            case "Polygon":
                mapData({...mapData(),
                    [id]: {
                        shape: 'Полигон',
                        outer_vertex: geom.geometry.coordinates[0].length -1,
                        inner_vertex: geom.geometry.coordinates[1] ? geom.geometry.coordinates[0].length -1 : undefined,
                        text: ''
                    }
                })
                break;
        }
    }


    React.useEffect(() => {
        let map = L.map('map').setView([51.505, -0.09], 13)
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
        map.on('pm:edit', (geom: any) => parsGeom(geom))
        map.on('pm:cut', (geom: any) => parsGeom(geom))
    })


    return <div className='row justify-content-center g-0'>
        <div className='col-10'>
            <div id='map' style={{height: '945px', width: '100%'}}></div>
        </div>
        <div className='col'>
            <Sidebar />
        </div>
    </div>
}