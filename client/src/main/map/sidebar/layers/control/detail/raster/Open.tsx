import * as React from 'react'
import * as L from 'leaflet'
import { ClassificationRaster, PreviewRaster, RasterInterface } from '../../../../../types/main/LayerTypes'
import { useLoading } from '../../../../../../../interface/stores/Loading'
import { useLayer } from '../../../../../../../analysis/stores/layer'
import { useSelectedRasterLay } from '../../../../../../../analysis/stores/selecetedRasterLay'
import { useTreeAvailableFiles } from '../../../../../../../analysis/stores/treeAvailableFiles'
import { useMapObject } from '../../../../../../../analysis/stores/MapObject'
import { ax } from '../../../../../../..'



export const Open = ({showAddImgMenu}: {showAddImgMenu: (key: boolean) => void}) => {
    const setLoading = useLoading(state => state.setLoading)
    const isLoading = useLoading(state => state.isLoading)
    const setTreeAvailableFiles = useTreeAvailableFiles(state => state.setTreeAvailableFiles)
    const treeAvailableFiles = useTreeAvailableFiles(state => state.treeAvailableFiles)


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
    const selectedRasterLay = useSelectedRasterLay(state => state.selectedRasterLay)
    const mapObject = useMapObject(state => state) as any

    const [state, setState] = React.useState({
        "scope": "0",
        "satellite": "0",
        "product": "0",
        "target": "0"
    })

    interface addLayerResponseType {
        header: string
        message: string
        datetime: string
        imgUrl: string
        meta: string
    }


    const addLayerHandler = () => {
        setLoading(true)
        ax.post<addLayerResponseType>("/workflow/add-layer", {
            input: {
                ...state
            }
        }).then(response => {
            console.log("data -> ", response.data)
                let metadata = JSON.parse(response.data.meta)
                L.geoJSON().addTo(mapObject).addData({type: 'LineString', coordinates: metadata["system:footprint"]["coordinates"]} as any)
                let layer = L.imageOverlay(response.data.imgUrl, metadata["system:footprint"]["coordinates"].map((point: Array<number>) => [point[1], point[0]]) ) as any
                layer.addTo(mapObject)


                let mapLayer: ClassificationRaster | PreviewRaster
                switch (state.scope) {
                    case "raw":
                        let date = metadata.DATE_ACQUIRED ? (metadata.DATE_ACQUIRED) : (new Date(metadata.GENERATION_TIME).toISOString().slice(0, 10))
                        let cloud = metadata.CLOUD_COVER ? (metadata.CLOUD_COVER.toFixed(2)) : (metadata.CLOUD_COVERAGE_ASSESSMENT.toFixed(2))
                        mapLayer = {
                            name: metadata["system:index"],
                            spacecraft: metadata['SPACECRAFT_NAME'] ?? metadata['SPACECRAFT_ID'],
                            layerType: "raster",
                            layer: layer,
                            date: date,
                            cloud: cloud,
                            positionInTable: Object.keys(layers).length + 1    
                        }
                        console.log('mapLayer! -> ', mapLayer)
                        setLayers({
                            [selectedRasterLay]: {
                                ...layers[selectedRasterLay],
                                imgs: {
                                    ...(layers[selectedRasterLay] as RasterInterface).imgs,
                                    [layer._leaflet_id]: mapLayer
                                }
                            } as RasterInterface
                        })
                        layers[selectedRasterLay].layer.addLayer(layer)
                        break;
                    case "classification":
                        mapLayer = {
                            name: state.target.slice(0, -4),
                            k: parseInt(state.product.slice(-6, -3)),
                            resultType: 'KMean',
                            layerType: "raster",
                            layer: layer,
                            positionInTable: Object.keys(layers).length + 1
                        }
                        setLayers({ 
                            ...layers,
                            [selectedRasterLay]: {
                                ...layers[selectedRasterLay],
                                imgs: {
                                    ...(layers[selectedRasterLay] as RasterInterface).imgs,
                                    [layer._leaflet_id]: mapLayer
                                }
                            } as RasterInterface
                        })
                        layers[selectedRasterLay].layer.addLayer(layer)
                        break;
                    default:
                        console.log('DEFAULT CASE from Open.tsx ->', state.scope)
                        break;
                }
                showAddImgMenu(false)
                setLoading(false)
        })
        
        
    }


    if(!treeAvailableFiles) return null
    return <div className='row justify-content-center'>
        <div className='col-11'>
            
            <div className='row justify-content-center mb-2'>
                <div className='col-12'>
                    Добавить слой
                    <select className='form-select' onChange={e => setState({scope: e.target.value, satellite: "0", product: "0", target: "0"})} >
                        <option value={"0"}>...</option>
                        {
                            Object.keys(treeAvailableFiles).slice(0,2).map(item => {
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
                            Object.keys(treeAvailableFiles[state["scope"]]).map(item => {
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
                                        Object.keys(treeAvailableFiles[state["scope"]][state["satellite"]]).map((item: string) => {
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
                                    treeAvailableFiles[state["scope"]][state["satellite"]][state["product"]].map((item: string) => {
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
                                    Object.keys(treeAvailableFiles[state["scope"]][state["satellite"]]).map((item: string) => {
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
                    <button
                    onClick={()=>addLayerHandler()}
                    className='btn btn-sm btn-success'
                    type='button'
                    disabled={isLoading}
                    >Add</button>
                </div>
            </div>

        </div>
    </div>
}