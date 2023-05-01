import * as React from 'react'
import * as L from 'leaflet'
import { clipMask, layers, mapLayerControl, mapObj, searchImages, selectedVecLay, tools } from '../map/rv'
import { VectorInterface } from '../map/types/main/LayerTypes'




export const Map2 = ({mapId}: {mapId: string}) => {

    const parsGeom = (geom: any, layerControl: any, map: any) => {

        let layerGroup = layers()[selectedVecLay()] as VectorInterface
        let g = geom.layer
        g.feature = {}
        g.feature.type = 'Feature'
        g.feature.properties = {}

        if(!tools().setPOI && !tools().setMask){
            Object.keys(layerGroup.properties).map((key: string) => {
                g.feature.properties[key] = ''
            })
            console.log('layerGroup ->', layerGroup)
            layerGroup.layer.addLayer(g)
        }
        // g.bindPopup('<button class="btn btn-primary">CHeck</button>')
        // g.on('click', e => console.log('AWESOME CLICK!', e))
        // TODO Функция, которая будет стучтаться в MapLayer с нужным ключём (айди созданной фигуры)
        // layers()[selectedVecLay].properties
        // g.on('click', (e: any) => e.target.pm._layer.bindPopup(`${new Date().toLocaleTimeString()}`))
        // vecLayer()[selectedVecLay()].layerGroup.addLayer(geom.layer)
        
        let id: string
        switch (geom.type) {
            case 'pm:create':
                console.log('case 1')
                id = geom.layer._leaflet_id
                geom.layer.on('pm:edit', (geom: any) => parsGeom(geom, layerControl, map))
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

        let data: VectorInterface | undefined = undefined
        switch (geom.geometry.type) {
            case "Point":
                if(tools().setPOI){
                    searchImages({...searchImages(), poi: geom.geometry.coordinates})
                    tools({...tools(), setPOI: false})
                } else {
                    // data = {
                    //     layerType: 'shape',
                    //     type: 'Точка',
                    //     outer_vertex: 1,
                    //     geom: geom,
                    //     layer: layer,
                    //     positionInTable: Object.keys(layers()).length +1,
                    //     color: '#fd7e14'
                    // }
                }
                break;
            case "LineString":
                // data = {
                //     layerType: 'shape',
                //     type: 'Полилиния',
                //     outer_vertex: geom.geometry.coordinates.length,
                //     geom: geom,
                //     layer: layer,
                //     positionInTable: Object.keys(layers()).length +1,
                //     color: '#fd7e14'
                // }
                break;
            case "Polygon":
                if(tools().setMask){
                    
                    clipMask({layer: layer, mask: geom})
                    let newGroupLayer = new L.FeatureGroup() as any
                    newGroupLayer.addLayer(layer)
                    newGroupLayer.addTo(map)
                    layerControl.addOverlay(newGroupLayer, 'clip mask')
                }
                // data = {
                //     layerType: 'shape',
                //     type: 'Полигон',
                //     outer_vertex: geom.geometry.coordinates[0].length -1,
                //     inner_vertex: geom.geometry.coordinates[1] ? geom.geometry.coordinates[0].length -1 : undefined,
                //     geom: geom,
                //     layer: layer,
                //     positionInTable: Object.keys(layers()).length +1,
                //     color: '#fd7e14'
                // }
                break;
            default:
                console.log('DEFAULT case from Map.tsx ->', geom.geometry.type)
            }

            // if(data != undefined) layers({ ...layers(), [id]: data })
    }


    React.useEffect(() => {
        let map: any = L.map(mapId, {'attributionControl': false}).setView([35.88, -5.3525], 10)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)
        map.pm.addControls({  
            position: 'topleft',
            drawCircleMarker: false,
            drawPolygon: false,
            drawPolyline: false,
            drawRectangle: false,
            drawCircle: false,  
            drawText: false,
            drawMarker: false
        })
        map.pm.setPathOptions(
            // { color: '#fd7e14' },
        );

        let layerControl = L.control.layers().addTo(map) as any
        mapLayerControl(layerControl)
        map.on('pm:create', (geom: any) => parsGeom(geom, layerControl, map))
        // map.on('pm:drawstart', () => {
        //     if(clipMask().layer != undefined){
        //         map.removeLayer(clipMask().layer)
        //     }
        // })
        // map.on('pm:cut', (geom: any) => parsGeom(geom, layerControl, map))
        mapObj(map)

    })




    return <div id={mapId} style={{height: '40vh', width: '100%'}}></div>

}