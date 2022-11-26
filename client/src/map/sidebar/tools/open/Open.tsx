import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import * as L from 'leaflet'
import { ADD_LAYER, TREE_AVAILABLE_FILES } from '../../../query'
import { layers, mapObj } from '../../../rv'
import { MapLayer } from '../../../types/newTypes'



export const Open = () => {
    const {data, loading} = useQuery(TREE_AVAILABLE_FILES, {fetchPolicy: 'network-only'})
    const [addLayer] = useLazyQuery(ADD_LAYER, {onCompleted: data => console.log(JSON.parse(data.addLayer.coordinates))})
    const mapObjSub = useReactiveVar(mapObj) as any
    const layersSub = useReactiveVar(layers)

    const [state, setState] = React.useState({
        "scope": "0",
        "satellite": "0",
        "product": "0"
    })

    const addLayerHandler = () => {
        addLayer({
            variables: {
                scope: state.scope,
                satellite: state.satellite,
                product: state.product
            },
            onCompleted: data => {
                let metadata = JSON.parse(data.addLayer.metadata)
                L.geoJSON().addTo(mapObjSub).addData({type: 'LineString', coordinates: metadata["system:footprint"]["coordinates"]} as any)
                let layer = L.imageOverlay(data.addLayer.imgUrl, metadata["system:footprint"]["coordinates"].map((point: Array<number>) => [point[1], point[0]]) )

                let date = metadata.DATE_ACQUIRED ? (metadata.DATE_ACQUIRED) : (new Date(metadata.GENERATION_TIME).toISOString().slice(0, 10))
                let cloud = metadata.CLOUD_COVER ? (metadata.CLOUD_COVER.toFixed(2)) : (metadata.CLOUD_COVERAGE_ASSESSMENT.toFixed(2))
                let mapLayer: MapLayer = {
                    spacecraft: metadata['SPACECRAFT_NAME'] ?? metadata['SPACECRAFT_ID'],
                    layerType: "preview",
                    layer: layer,
                    date: date,
                    cloud: cloud,
                    positionInTable: Object.keys(layersSub).length + 1
                }
                layers({ ...layersSub, [metadata["system:index"]]: mapLayer })
                layer.addTo(mapObjSub)
            }
        })
    }

    if(loading) return null
    if(data) console.log(data)
    return <div className='row justify-content-center'>
        <div className='col-11'>
            <p>Добавить слой</p>
            <select className='form-select' onChange={e => setState({...state, "scope": e.target.value})} >
                <option value={"0"}>...</option>
                {
                    Object.keys(data.treeAvailableFiles).map(item => {
                        return <option key={item} value={item}>{item}</option>
                    })
                }
            </select>
            <p>Спутник</p>
            <select className='form-select' onChange={e => setState({...state, "satellite": e.target.value})} >
                <option value={"0"}>...</option>
                {
                    state.scope != "0" &&
                    Object.keys(data.treeAvailableFiles[state["scope"]]).map(item => {
                        return <option key={item} value={item}>{item}</option>
                    })
                }
            </select>
            <p>Продукт</p>
            <select className='form-select' onChange={e => setState({...state, "product": e.target.value})} >
                <option value={"0"}>...</option>
                {
                    state.scope != "0" && state.satellite != "0" &&
                    data.treeAvailableFiles[state["scope"]][state["satellite"]].map((item: string) => {
                        return <option key={item} value={item}>{item}</option>
                    })
                }
            </select>
            <button onClick={()=>addLayer({variables: {
                scope: state.scope,
                satellite: state.satellite,
                product: state.product
                }})} className='btn btn-sm btn-success' type='button'>add layer</button>
            <button onClick={()=>addLayerHandler()} className='btn btn-sm btn-success' type='button'>type2</button>
        </div>
    </div>
}