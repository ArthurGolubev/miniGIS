import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { GET_PREVIEW } from '../../../queries'
import * as L from 'leaflet'
import { isLoading, mapObj, selectedImage, searchImages, layers, toasts } from '../../../rv'
import { MapLayer, MapLayers, PreviewRaster, RasterInterface } from '../../../types/main/LayerTypes'


export const ImagesList = () => {
    const mapObjSub         = useReactiveVar(mapObj) as any
    const searchImagesSub = useReactiveVar(searchImages)
    const layersSub: MapLayers = useReactiveVar(layers)
    
    const [getImagePreview, {data: data2, loading: loading2, error: error2}] = useLazyQuery(GET_PREVIEW)
    const getImagePreviewHandler = (metadata: any) => {
        isLoading(true)
        console.log('metadata -> ', metadata)
        getImagePreview({variables: {
            systemIndex: metadata["system:index"],
            sensor: searchImagesSub.sensor
        },
        fetchPolicy: 'network-only',
        onCompleted: data => {
            let coordinates = metadata["system:footprint"]["coordinates"]
            L.geoJSON().addTo(mapObjSub).addData({type: 'LineString', coordinates: coordinates} as any)
            let layer = L.imageOverlay(data.getImagePreview.imgUrl, coordinates.map((point: Array<number>) => [point[1], point[0]]) ) as any

            let date = metadata.DATE_ACQUIRED ? (metadata.DATE_ACQUIRED) : (new Date(metadata.GENERATION_TIME).toISOString().slice(0, 10))
            let cloud = metadata.CLOUD_COVER ? (metadata.CLOUD_COVER.toFixed(2)) : (metadata.CLOUD_COVERAGE_ASSESSMENT.toFixed(2))
            let mapLayer: PreviewRaster = {
                name: undefined,
                spacecraft: metadata['SPACECRAFT_NAME'] ?? metadata['SPACECRAFT_ID'],
                layerType: "raster",
                layer: layer,
                date: date,
                cloud: cloud,
                positionInTable: Object.keys(layersSub).length + 1
            }
            layers({ ...layersSub, [metadata["system:index"]]: mapLayer })
            layer.addTo(mapObjSub)
            console.log('TEST 123 ->', data)
            selectedImage({
                metadata: metadata,
                imgUrl: data.getImagePreview.imgUrl,
                sensor: data.getImagePreview.sensor,
                systemIndex: data.getImagePreview.systemIndex
            })
            toasts({[new Date().toLocaleString()]: {
                header: data.getImagePreview.header,
                message: data.getImagePreview.message,
                show: true,
                datetime: new Date(data.getImagePreview.datetime),
                color: 'text-bg-success'
            }})
            isLoading(false)
        }
        })
    }

    return <div className='row justify-content-center overflow-auto'>
        <div className='col-12 ' style={{maxHeight: "400px"}}>
            <button onClick={()=>console.log("e ->", error2, "l ->", loading2, "d ->", data2)} className='btn btn-sm btn-primary' type='button'>INFO</button>
            <ul className='mt-1'>
                {
                    searchImagesSub.images.map((item: any, iter: number) => {
                        return <li key={iter} className="mb-1">
                            <div className="d-grid gap-2 col-10 mx-auto">
                                <button className="btn btn-sm btn-outline-primary"
                                onClick={()=>getImagePreviewHandler(item)}
                                disabled={loading2}>
                                    {
                                        `
                                        ${item.DATE_ACQUIRED ? (item.DATE_ACQUIRED) : (new Date(item.GENERATION_TIME).toISOString().slice(0, 10))} 
                                        Cloud Cover 
                                        ${item.CLOUD_COVER ? (item.CLOUD_COVER.toFixed(2)) : (item.CLOUD_COVERAGE_ASSESSMENT.toFixed(2))} %
                                        `
                                    }
                                </button>
                            </div>
                        </li>
                    })
                }
            </ul>
        </div>
    </div>
}