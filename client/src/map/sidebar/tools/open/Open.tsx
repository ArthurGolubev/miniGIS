import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import * as L from 'leaflet'
import { ADD_LAYER, TEST_SHP, TEST_SHP_2, TREE_AVAILABLE_FILES } from '../../../query'
import { layers, mapObj } from '../../../rv'
import { MapLayer } from '../../../types/newTypes'



export const Open = () => {
    const {data, loading} = useQuery(TREE_AVAILABLE_FILES, {fetchPolicy: 'network-only'})
    const [addLayer] = useLazyQuery(ADD_LAYER)
    const [testShp] = useLazyQuery(TEST_SHP, {fetchPolicy: "network-only"})
    const [testShp2] = useLazyQuery(TEST_SHP_2, {fetchPolicy: "network-only"})
    const mapObjSub = useReactiveVar(mapObj) as any
    const layersSub = useReactiveVar(layers)

    const [state, setState] = React.useState({
        "scope": "0",
        "satellite": "0",
        "product": "0",
        "target": "0"
    })

    const testShpHandler = () => {
        testShp({
            onCompleted: data => {
                console.log(data.shpRead.features)
                // L.geoJSON(data.shpRead.features).addTo(mapObjSub)
                /// TEST

                let point1 = L.geoJSON().addData(data.shpRead.features).bindPopup('Test1')
                let point2 = L.marker([56.019, 92.881]).bindPopup('Test2')

                let group1 = L.layerGroup([point1, point2])

                let c = group1.addTo(mapObjSub) as any
                let mapLayer: MapLayer
                mapLayer = {
                    layerType: 'shape',
                    layer: c,
                    type: 'Points',
                    outer_vertex: 1,
                    geom: [],
                    positionInTable: Object.keys(layersSub).length + 1    ,
                    properties: {}
                }
                layers({ ...layersSub, test1: mapLayer })
                L.control.layers().addOverlay(c, "test1").addTo(mapObjSub)







                ///
                console.log('case 1 ', mapObjSub.pm.getGeomanLayers())
                console.log('case 2 ', mapObjSub.pm.getGeomanLayers(true))
                console.log('case 3 ', mapObjSub.pm.getGeomanLayers(true).toGeoJSON())
            }
        })
    }

    const testShpHandler2 = () => {
        let fc = mapObjSub.pm.getGeomanLayers(true).toGeoJSON()
        console.log('case 3 ', fc)
        testShp2({variables: {
            shpData: JSON.stringify(fc),
            shpName: 'Красноярск'
        } })

    }

    const addLayerHandler = () => {
        addLayer({
            variables: {
                ...state
            },
            onCompleted: data => {
                console.log("data -> ", data)
                let metadata = JSON.parse(data.addLayer.metadata)
                L.geoJSON().addTo(mapObjSub).addData({type: 'LineString', coordinates: metadata["system:footprint"]["coordinates"]} as any)
                let layer = L.imageOverlay(data.addLayer.imgUrl, metadata["system:footprint"]["coordinates"].map((point: Array<number>) => [point[1], point[0]]) ) as any
                let mapLayer: MapLayer
                switch (state.scope) {
                    case "raw":
                        let date = metadata.DATE_ACQUIRED ? (metadata.DATE_ACQUIRED) : (new Date(metadata.GENERATION_TIME).toISOString().slice(0, 10))
                        let cloud = metadata.CLOUD_COVER ? (metadata.CLOUD_COVER.toFixed(2)) : (metadata.CLOUD_COVERAGE_ASSESSMENT.toFixed(2))
                        mapLayer = {
                            spacecraft: metadata['SPACECRAFT_NAME'] ?? metadata['SPACECRAFT_ID'],
                            layerType: "preview",
                            layer: layer,
                            date: date,
                            cloud: cloud,
                            positionInTable: Object.keys(layersSub).length + 1    
                        }
                        layers({ ...layersSub, [metadata["system:index"]]: mapLayer })
                        break;
                    case "classification":
                        mapLayer = {
                            k: parseInt(state.product.slice(-6, -3)),
                            resultType: 'KMean',
                            layerType: "result",
                            layer: layer,
                            positionInTable: Object.keys(layersSub).length + 1
                        }
                        layers({ ...layersSub, [state.target.slice(0, -4)]: mapLayer })

                        break;
                    default:
                        break;
                }
                layer.addTo(mapObjSub)
            }
        })
    }

    const testShpHandler3 = () => {
        testShp2({ variables: {
            shpData: '',
            shpName: 'geom_from_map'
            }
        })
    }

    if(!data || loading) return null
    return <div className='row justify-content-center'>
        <button onClick={()=>testShpHandler()} className='btn btn-sm btn-success' type='button'>get shape</button>
        <button onClick={()=>testShpHandler2()} className='btn btn-sm btn-success' type='button'>save shp</button>
        <button onClick={()=>testShpHandler3()} className='btn btn-sm btn-primary' type='button'>save geom from map</button>
        <div className='col-11'>
            
            <div className='row justify-content-center mb-2'>
                <div className='col-12'>
                    Добавить слой
                    <select className='form-select' onChange={e => setState({scope: e.target.value, satellite: "0", product: "0", target: "0"})} >
                        <option value={"0"}>...</option>
                        {
                            Object.keys(data.treeAvailableFiles).map(item => {
                                return <option key={item} value={item}>{item}</option>
                            })
                        }
                    </select>
                </div>
            </div>

            <div className='row justify-content-center mb-2'>
                <div className='col-12'>
                    Спутник
                    <select className='form-select'
                        onChange={e => setState({scope: state.scope, satellite: e.target.value, product: "0", target: "0"})}
                        value={state.satellite}>
                        <option value={"0"}>...</option>
                        {
                            state.scope != "0" &&
                            Object.keys(data.treeAvailableFiles[state["scope"]]).map(item => {
                                return <option key={item} value={item}>{item}</option>
                            })
                        }
                    </select>
                </div>
            </div>

            <div className='row justify-content-center mb-2'>
                <div className='col-12'>
                    Продукт
                    {
                        state.scope != 'raw' && state.satellite != "0" &&
                        <div className='row justify-content-center mb-2'>
                            <div className='col-12'>
                                <select className='form-select' onChange={e => setState({...state, "product": e.target.value})} value={state.product}>
                                    <option value={"0"}>...</option>
                                    {
                                        state.scope != "0" && state.satellite != "0" &&
                                        Object.keys(data.treeAvailableFiles[state["scope"]][state["satellite"]]).map((item: string) => {
                                            return <option key={item} value={item}>{item}</option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    }
                    {
                        state.scope != 'raw' && state.satellite != "0" && state.product != "0" &&
                        <div className='row justify-content-center mb-2'>
                            <div className='col-12'>
                                {
                                    data.treeAvailableFiles[state["scope"]][state["satellite"]][state["product"]].map((item: string) => {
                                        return <div className='form-check' key={item}
                                        onChange={() => setState({...state, target: item})}>
                                            <input id={`check-${item}`} className='form-check-input' type={"radio"} />
                                            <label htmlFor={`check-${item}`} className="text-break">{item}</label>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    }
                    {
                        state.scope == 'raw' && state.satellite != "0" && 
                        <div className='row justify-content-center mb-2'>
                            <div className='col-12'>
                                {
                                    Object.keys(data.treeAvailableFiles[state["scope"]][state["satellite"]]).map((item: string) => {
                                        return <div className='form-check mb-1 mt-1' key={item}>
                                            <input id={`check-${item}`} className='form-check-input' type={"radio"} 
                                            onChange={() => setState({...state, product: item, target: item})} />
                                            <label htmlFor={`check-${item}`} className="text-break">{item}</label>
                                        </div>
                                    })
                                }
                                
                            </div>
                        </div>
                    }
                </div>
            </div>

            <div className='row justify-content-center mb-2'>
                <div className='col-12'>
                    <button onClick={()=>addLayerHandler()} className='btn btn-sm btn-success' type='button'>type2</button>
                    <button onClick={()=>console.log(state, data)} className='btn btn-sm btn-primary' type='button'>state</button>
                </div>
            </div>

        </div>
    </div>
}