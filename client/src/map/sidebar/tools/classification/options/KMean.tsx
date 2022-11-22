import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import * as L from 'leaflet'
import { CLASSIFY_K_MEAN } from '../../../../query'
import { classification, isLoading, layers, mapObj, selectedFiles } from '../../../../rv'
import { MapLayer } from '../../../../types/newTypes'


export const KMean = () => {
    const classificationSub = useReactiveVar(classification)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const mapObjSub = useReactiveVar(mapObj) as any
    const layersSub = useReactiveVar(layers)
    const [classify, {loading}] = useLazyQuery(CLASSIFY_K_MEAN)

    const classifyHandler = () => {
        isLoading(true)
        classify({
            variables: {filePath: selectedFilesSub.files.Classification[0], k: classificationSub.classes},
            fetchPolicy: 'network-only',
            onCompleted: data => {
                let coordinates = data.classifyKMean.coordinates
                let imgUrl = data.classifyKMean.imgUrl
                let k = data.classifyKMean.k
                let fileName = data.classifyKMean.fileName.slice(0,-4)
                L.geoJSON().addTo(mapObjSub).addData({type: 'LineString', coordinates: coordinates} as any)
                let layer = L.imageOverlay(imgUrl, coordinates.map((point: Array<number>) => [point[1], point[0]]) )
                let mapLayer: MapLayer = {
                    k: k,
                    resultType: 'KMean',
                    layerType: "result",
                    layer: layer,
                    positionInTable: Object.keys(layersSub).length + 1
                }
                layers({ ...layersSub, [fileName]: mapLayer })
                layer.addTo(mapObjSub)
                isLoading(false)
            },
            onError: () => isLoading(false)
        })
    }


    return <div className='row justify-content-start mb-2'>
        <div className='col-12'>
            <div className='row justify-content-start mb-2'>
                <div className='col-4'>
                    <div className='input-group'>
                        <label className='input-group-text' htmlFor='classes'>k:</label>
                        <input className="form-control" type="number" min={1} max={30}
                            onChange={e => classification({...classificationSub, classes: parseInt(e.target.value) })}
                        />
                    </div>
                </div>
            </div>
            <div className='row justify-content-start mb-2'>
                <div className='col-4'>
                    <button onClick={()=>classifyHandler()} className='btn btn-sm btn-success' type='button' disabled={loading}>classify</button>
                </div>
            </div>

        </div>
    </div>
}