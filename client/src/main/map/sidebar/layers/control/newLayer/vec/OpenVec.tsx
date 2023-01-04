import * as L from 'leaflet'
import * as React from 'react'
import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import { SHP_READ, TREE_AVAILABLE_FILES } from '../../../../../queries'
import { isLoading, layers, mapLayerControl, mapObj } from '../../../../../rv'
import { VectorInterface } from '../../../../../types/main/LayerTypes'
import * as moment from 'moment'


export const OpenVec = ({showLayerAddControl}: {showLayerAddControl: (status: boolean) => void}) => {
    const [state, setState] = React.useState(undefined)
    const {data, loading, error} = useQuery(TREE_AVAILABLE_FILES)
    const [shpRead] = useLazyQuery(SHP_READ, {fetchPolicy: "network-only"})
    const mapObjSub = useReactiveVar(mapObj) as any
    const layersSub = useReactiveVar(layers)
    const mapLayerControlSub = useReactiveVar(mapLayerControl) as any
    const isLoadingSub = useReactiveVar(isLoading)

    const shpReadHandler = () => {
        console.log('state -> ', state)
        isLoading(true)
        shpRead({
            variables: {shpName: state},
            onCompleted: data => {

                console.log('shpRead ->', data)
                let layerKey = state.split("/").slice(-1)[0]
                let newGroupLayer = new L.FeatureGroup() as any
                newGroupLayer.addTo(mapObjSub)

                const setProps = () => {
                    let props: {
                        [propName: string]: {
                            fieldType: string,
                        }} = {}
                    Object.entries(data.shpRead.features[0].properties).map((prop: [string, string]) => {
                        let attrType: string = prop[0].split("_").slice(-1)[0]
                        console.log('attrType -> ', attrType)
                        props[prop[0]] = { fieldType: attrType}
                    })    
                    return props
                }

                let type: 'Points' | 'Polylines' | 'Polygones'
                switch (data.shpRead.features[0].geometry.type) {
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
                        console.log('Default case from OpenVec.tsx', data.shpRead.features[0].geometry.type)
                        break;
                }
                let data1: VectorInterface
                data1 = {
                    layerType: 'vector',
                    type: type,
                    layer: newGroupLayer,
                    geom: undefined,
                    positionInTable: Object.keys(layersSub).length +1,
                    color: '#fd7e14',
                    properties: setProps(),
                }

                data.shpRead.features.map((item: any) => {
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
                

                
                layers({ ...layersSub, [layerKey]: data1 })
                mapLayerControlSub.addOverlay(data1.layer, layerKey)
                isLoading(false)
            }
        })

    }

    if(data && !loading) return <div className='row justify-content-center'>
        <div className='col-11'>
            
            <div className='row justify-content-center mb-2'>
                <div className='col-12'>
                    Добавить слой
                    <select
                    onChange={e => setState(e.target.value)}
                    className='form-select'>
                        <option value={"0"}>...</option>
                        {
                            data.treeAvailableFiles.vector.map((item: string) => {
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
                    disabled={isLoadingSub}
                    className='btn btn-sm btn-success' type='button'>Добавить</button>
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    <button onClick={()=>console.log(layersSub)} className='btn btn-sm btn-success' type='button'>layersSub</button>
                </div>
            </div>

        </div>
    </div>

    return null
}