import * as React from 'react'
import * as L from 'leaflet'
import { PreviewRaster } from '../../../types/main/LayerTypes'
import { useSearchImages } from '../../../../../analysis/stores/searchImages'
import { useToasts } from '../../../../../interface/stores/Toasts'
import { useLoading } from '../../../../../interface/stores/Loading'
import { useLayer } from '../../../../../analysis/stores/layer'
import { useSelectedImage } from '../../../../../analysis/stores/selectedImage'
import { useMapObject } from '../../../../../analysis/stores/MapObject'
import { ax } from '../../../../../axiosInstance'


export const ImagesList = () => {

    const setLayers = useLayer(state => state.setLayers)
    const setToast = useToasts(state => state.setToast)
    const images = useSearchImages(state => state.images)
    const sensor = useSearchImages(state => state.sensor)
    const setLoading = useLoading(state => state.setLoading)
    const setSelectedImage = useSelectedImage(statae => statae.setSelectedImage)
    const mapObject = useMapObject(state => state) as any

    const layers = useLayer(state => state.layers)
    
    const getImagePreviewHandler = (metadata: any) => {
        setLoading(true)

        interface getPreviewResponseType {
            imgUrl: string
            header: string
            message: string
            datetime: string
            sensor: string
            systemIndex: string
            bounds: Array<Array<number>>
        }

        const getPreview = () => ax.get<getPreviewResponseType>(`/workflow/get-image-preview/${sensor}/${metadata["system:index"]}`, )
        .then(response => {
            // let coordinates = metadata["system:footprint"]["coordinates"]
            let coordinates = response.data.bounds
            console.log('some data -> ', response.data)
            console.log('some coordinates -> ', coordinates)
            L.geoJSON().addTo(mapObject).addData({type: 'LineString', coordinates: coordinates} as any)
            let layer = L.imageOverlay(response.data.imgUrl, coordinates.map((point: Array<number>) => [point[1], point[0]]) ) as any

            let date = metadata.DATE_ACQUIRED ? (metadata.DATE_ACQUIRED) : (new Date(metadata.GENERATION_TIME).toISOString().slice(0, 10))
            let cloud = metadata.CLOUD_COVER ? (metadata.CLOUD_COVER.toFixed(2)) : (metadata.CLOUD_COVERAGE_ASSESSMENT.toFixed(2))
            let mapLayer: PreviewRaster = {
                name: undefined,
                spacecraft: metadata['SPACECRAFT_ID'] ?? metadata['SPACECRAFT_ID'],
                layerType: "raster",
                layer: layer,
                date: date,
                cloud: cloud,
                positionInTable: Object.keys(layers).length + 1
            }
            setLayers({ [metadata["system:index"]]: mapLayer })
            layer.addTo(mapObject)
            setSelectedImage({
                metadata: metadata,
                imgUrl: response.data.imgUrl,
                sensor: response.data.sensor,
                systemIndex: response.data.systemIndex
            })
            setToast({[new Date().toLocaleString()]: {
                header: response.data.header,
                message: response.data.message,
                show: true,
                datetime: new Date(response.data.datetime),
                color: 'text-bg-success'
            }})
            setLoading(false)
        })
    }

    return <div className='row justify-content-center overflow-auto mt-3'>
        <div className='col-12 ' style={{maxHeight: "400px"}}>
            <ul className='mt-1'>
                {
                    images.map((item: any, iter: number) => {
                        return <li key={iter} className="mb-1">
                            <div className="d-grid gap-2 col-10 mx-auto">
                                <button className="btn btn-sm btn-outline-primary"
                                onClick={() => getImagePreviewHandler(item)}
                                // disabled={loading2}
                                >
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