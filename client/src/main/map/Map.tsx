import * as React from 'react'
import * as L from 'leaflet'
import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { VectorInterface } from './types/main/LayerTypes'
import { Sidebar } from './sidebar/Sidebar'
import { useLayer } from '../../analysis/stores/layer'
import { useSelectedVecLay } from '../../analysis/stores/selectedVecLay'
import { useToolsToggles } from '../../analysis/stores/toolsToggles'
import { useSearchImages } from '../../analysis/stores/searchImages'
import { useMapLayerControl } from '../../analysis/stores/mapLayerControl'
import { useClipMask } from '../../analysis/stores/clipMask'
import { useMapObject } from '../../analysis/stores/MapObject'


export const Map = () => {


    const parsGeom = (geom: any, layerControl: any, map: any) => {
        const setSearchImages = useSearchImages(state => state.setSearchImages)
        const showTools = useToolsToggles(state => state.showTools)
        const setLayer = useClipMask(state => state.setLayer)
        const setMask = useClipMask(state => state.setMask)

        let layerGroup = useLayer(state => state.layers)[useSelectedVecLay(state => state.selectedVecLay)] as VectorInterface
        let g = geom.layer
        g.feature = {}
        g.feature.type = 'Feature'
        g.feature.properties = {}

        if(!useToolsToggles(state => state.POI) && !useToolsToggles(state => state.mask)){
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
                if(useToolsToggles(state => state.POI)){
                    setSearchImages({poi: geom.geometry.coordinates})
                    showTools({POI: false})
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
                if(useToolsToggles(state => state.mask)){
                    
                    // Работает
                    // clipMask({layer: layer, mask: geom})
                    // let newGroupLayer = new L.FeatureGroup() as any
                    // newGroupLayer.addLayer(layer)
                    // newGroupLayer.addTo(map)
                    // layerControl.addOverlay(newGroupLayer, 'clip mask')
                    
                    // Проверяю
                    let newGroupLayer = new L.FeatureGroup() as any
                    newGroupLayer.addLayer(layer)
                    newGroupLayer.addTo(map)
                    layerControl.addOverlay(newGroupLayer, 'clip mask')
                    setMask(geom)
                    setLayer(newGroupLayer)
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
        const setMapObject = useMapObject(state => state.setMapObject)
        let map: any = L.map('map', {'attributionControl': false}).setView([35.88, -5.3525], 10)
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
        const setMapLayerControl = useMapLayerControl(state => state.setMapLayerControl)
        setMapLayerControl(layerControl)
        map.on('pm:create', (geom: any) => parsGeom(geom, layerControl, map))
        map.on('pm:drawstart', () => {
            if(useClipMask(state => state.layer) != undefined){
                map.removeLayer(useClipMask(state => state.layer))
            }
        })
        map.on('pm:cut', (geom: any) => parsGeom(geom, layerControl, map))
        setMapObject(map)

    })



    // return <div id='map' style={{height: '95vh', width: '100%'}}></div>
    return <div className='row justify-content-center g-0'>
        <div className='col-9'>
            <div id='map' style={{height: '95vh', width: '100%'}}></div>
        </div>
        <div className='col-3'>
            <Sidebar />
        </div>
    </div>
}