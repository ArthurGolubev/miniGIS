import * as L from 'leaflet'
import * as React from 'react'
import { VectorInterface } from '../../../../../types/main/LayerTypes'
import * as moment from 'moment'
import { useLoading } from '../../../../../../../interface/stores/Loading'
import { useLayer } from '../../../../../../../analysis/stores/layer'
import { useMapLayerControl } from '../../../../../../../analysis/stores/mapLayerControl'
import { useTreeAvailableFiles } from '../../../../../../../analysis/stores/treeAvailableFiles'
import { useMapObject } from '../../../../../../../analysis/stores/MapObject'
import { ax } from '../../../../../../..'


export const OpenVec = ({showLayerAddControl}: {showLayerAddControl: (status: boolean) => void}) => {
    const [state, setState] = React.useState(undefined)
    const isLoading = useLoading(state => state.isLoading)
    const setLoading = useLoading(state => state.setLoading)
    const setTreeAvailableFiles = useTreeAvailableFiles(state => state.setTreeAvailableFiles)
    const treeAvailableFiles = useTreeAvailableFiles(state => state.treeAvailableFiles)
    const mapObject = useMapObject(state => state)

    interface treeAvailableFilesResponseType {
        items: any
    }

    ax.get<treeAvailableFilesResponseType>("/workflow/shp-read").then(response => {
        setLoading(false)
        let c = {} as any
        response.data.items.map((item: any) => {
            let key: string = Object.keys(item)[1]
            if(key != "items"){
                c[key] = item[key]
            }
        })
        setTreeAvailableFiles(c)
    })
    const layers = useLayer(state => state.layers)
    const setLayers = useLayer(state => state.setLayers)
    const mapLayerControl = useMapLayerControl(state => state.mapLayerControl)

    interface shpReadResponseType {
        bbox: string
        features: any
        type: string
    }

    const shpReadHandler = () => {
        console.log('state -> ', state)
        setLoading(true)
        ax.post<shpReadResponseType>('/workflow/shp-read', {
            input: {
                shpName: state
            }
        }).then(response => {
            console.log('shpRead ->', response)
                let layerKey = state.split("/").slice(-1)[0]
                let newGroupLayer = new L.FeatureGroup() as any
                newGroupLayer.addTo(mapObject)

                const setProps = () => {
                    let props: {
                        [propName: string]: {
                            fieldType: string,
                        }} = {}
                    Object.entries(response.data.features[0].properties).map((prop: [string, string]) => {
                        let attrType: string = prop[0].split("_").slice(-1)[0]
                        console.log('attrType -> ', attrType)
                        props[prop[0]] = { fieldType: attrType}
                    })    
                    return props
                }

                let type: 'Points' | 'Polylines' | 'Polygones'
                switch (response.data.features[0].geometry.type) {
                    case 'Point':
                        type = 'Points'
                        break;
                    case 'LineString':
                        type = 'Polylines'
                        break;
                    case 'Polygon':
                        type = 'Polygones'
                        break;
                    default:
                        console.log('Default case from OpenVec.tsx', response.data.features[0].geometry.type)
                        break;
                }
                let data1: VectorInterface
                data1 = {
                    layerType: 'vector',
                    type: type,
                    layer: newGroupLayer,
                    geom: undefined,
                    positionInTable: Object.keys(layers).length +1,
                    color: '#fd7e14',
                    properties: setProps(),
                }

                response.data.features.map((item: any) => {
                    let attr = item.properties
                    let shape = L.geoJSON(item) as any
                    shape.feature = {}
                    shape.feature.type = 'Feature'
                    shape.feature.properties = attr
                    Object.entries(attr).map((prop: [string, string]) => {
                        let value
                        switch (prop[0].split('_').slice(-1)[0]) {
                            case "C":
                                value = prop[1]
                                break;
                            case "D":
                                value = prop[1] != null ? moment(prop[1], 'YYYYMMDD').format('YYYY-MM-DD') : ''
                                break;
                            case "L":
                                // value = (prop[1] as unknown) == true ? 'true' : 'false'
                                value = prop[1]
                            case "N":
                                value = prop[1]
                                break;
                            default:
                                console.log('DEFAULT CASE from OpenVec.tsx')
                                break;
                        }
                        shape.feature.properties[prop[0]] = value
                    })
                    newGroupLayer.addLayer(shape)
                })
                
                setLayers({ [layerKey]: data1 })
                mapLayerControl.addOverlay(data1.layer, layerKey)
                setLoading(false)
        })

    }

    return <div className='row justify-content-center'>
        <div className='col-11'>
            
            <div className='row justify-content-center mb-2'>
                <div className='col-12'>
                    Добавить слой
                    <select
                    onChange={e => setState(e.target.value)}
                    className='form-select'>
                        <option value={"0"}>...</option>
                        {
                            treeAvailableFiles.vector.map((item: string) => {
                                return <option key={item} value={item}>{item}</option>
                            })
                        }
                    </select>
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    <button
                    onClick={()=>shpReadHandler()}
                    disabled={isLoading}
                    className='btn btn-sm btn-success' type='button'>Добавить</button>
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    <button onClick={()=>console.log(layers)} className='btn btn-sm btn-success' type='button'>layersSub</button>
                </div>
            </div>

        </div>
    </div>

    return null
}