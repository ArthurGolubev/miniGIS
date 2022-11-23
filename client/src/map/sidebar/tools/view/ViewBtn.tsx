import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { AVAILABLE_FILES, GET_CLASSIFICATION_LAYER } from '../../../query'
import { isLoading, layers, mapObj, selectedFiles, toasts, tools } from '../../../rv'
import * as L from 'leaflet'
import { MapLayer, MapLayers } from '../../../types/newTypes'


export const ViewBtn = () => {
    const toolsSub = useReactiveVar(tools)
    const {data} = useQuery(AVAILABLE_FILES, {variables: {to: toolsSub.show}})
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const mapObjSub         = useReactiveVar(mapObj) as any
    const layersSub: MapLayers = useReactiveVar(layers)
    const [getClassificationLayer] = useLazyQuery(GET_CLASSIFICATION_LAYER)


    const se = () => {
        isLoading(true)
        getClassificationLayer({
            variables: {filePath: selectedFilesSub.files.Open[0]},
            onCompleted: data => {
                let coordinates = data.getClassificationLayer.coordinates
                let imgUrl = data.getClassificationLayer.imgUrl
                let fileName = data.getClassificationLayer.fileName
                L.geoJSON().addTo(mapObjSub).addData({type: 'LineString', coordinates: coordinates} as any)
                let layer = L.imageOverlay(imgUrl, coordinates.map((point: Array<number>) => [point[1], point[0]]) )
                let mapLayer: MapLayer = {
                    layerType: "result",
                    layer: layer,
                    positionInTable: Object.keys(layersSub).length + 1,
                    resultType: "KMean"
                }
                layers({ ...layersSub, [fileName]: mapLayer })
                layer.addTo(mapObjSub)
                toasts({[new Date().toLocaleString()]: {
                    header: data.getClassificationLayer.header,
                    message: data.getClassificationLayer.message,
                    show: true,
                    datetime: new Date(data.getClassificationLayer.datetime),
                    color: 'text-bg-success'
                }})
                isLoading(false)
            },
        })
    }


    return <div className='row justify-content-center'>
        <div className='col-4'>
            <button onClick={()=>console.log(data)} className='btn btn-sm btn-success' type='button'>data</button>
            { selectedFilesSub.files?.Open.length != undefined && <img src={ selectedFilesSub.files?.Open[0] } /> }
            <button onClick={()=>se()} className='btn btn-sm btn-success' type='button'>btn</button>
        </div>
    </div>
}