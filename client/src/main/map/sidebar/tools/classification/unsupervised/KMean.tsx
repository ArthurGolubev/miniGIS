import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import * as L from 'leaflet'
import { AVAILABLE_FILES } from '../../../../restQueries'
import { CLASSIFY_K_MEAN } from '../../../../restMutations'
import { classification, isLoading, layers, mapLayerControl, mapObj, selectedFiles, toasts, tools } from '../../../../rv'
import { ClassificationRaster, MapLayer } from '../../../../types/main/LayerTypes'
import { MapContainer, TileLayer, useMap, ImageOverlay} from 'react-leaflet'
import { AvailableFiles } from '../../AvailableFiles'
import { useLocation } from 'react-router'
import { ChangeMapView } from '../resultOnMap/ChangeMapView'
import { ResultOnMap } from '../resultOnMap/ResultOnMap'


export const KMean = () => {
    const classificationSub = useReactiveVar(classification)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const mapObjSub = useReactiveVar(mapObj) as any
    const layersSub = useReactiveVar(layers)
    const [classify, {data, loading}] = useMutation(CLASSIFY_K_MEAN, {fetchPolicy: 'network-only'})
    const location = useLocation()
    console.log('selectedFilesSub.files -> ', selectedFilesSub.files)
    
    let center = [35.88, -5.3525]
    
    const classifyHandler = () => {
        isLoading(true)
        classify({
            variables: {
                options: {
                    filePath: selectedFilesSub.files[location.pathname][0],
                    k: classificationSub.classes
                }
            },
            fetchPolicy: 'network-only',
            onCompleted: data => {
                let lng: number = data.classifyKMean.coordinates[0][1]
                let lat: number = data.classifyKMean.coordinates[0][0] 
                center = [lng, lat]
            //     console.log('SOME SUPER DATA -> ', data)
            //     let coordinates = data.classifyKMean.coordinates
            //     let imgUrl = data.classifyKMean.imgUrl
            //     let k = data.classifyKMean.k
            //     let fileName = data.classifyKMean.fileName.slice(0,-4)
            //     L.geoJSON().addTo(mapObjSub).addData({type: 'LineString', coordinates: coordinates} as any)
            //     let layer = L.imageOverlay(imgUrl, coordinates.map((point: Array<number>) => [point[1], point[0]]) ) as any
            //     let mapLayer: ClassificationRaster = {
            //         name: fileName,
            //         k: k,
            //         resultType: 'KMean',
            //         layerType: "raster",
            //         layer: layer,
            //         positionInTable: Object.keys(layersSub).length + 1
            //     }
            //     layers({ ...layersSub, [fileName]: mapLayer })
            //     layer.addTo(mapObjSub)
            //     toasts({[new Date().toLocaleString()]: {
            //         header: data.classifyKMean.header,
            //         message: data.classifyKMean.message,
            //         show: true,
            //         datetime: new Date(data.classifyKMean.datetime),
            //         color: 'text-bg-success'
            //     }})
                isLoading(false)
            },
            refetchQueries: [
                {query: AVAILABLE_FILES, variables: {to: 'clip'}},
                {query: AVAILABLE_FILES, variables: {to: 'stack'}},
                {query: AVAILABLE_FILES, variables: {to: 'unsupervised'}},
                {query: AVAILABLE_FILES, variables: {to: 'supervised'}},
            ]
        })
    }



    return <div className='row justify-content-center'>
        <div className='col-12'>
            {/* -------------------------------------------Header-Start------------------------------------------ */}
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h2>Kmean</h2>
                </div>
            </div>
            {/* -------------------------------------------Header-End-------------------------------------------- */}

            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className='row justify-content-center'>

                        {/* -------------------------------------------Map-Start------------------------------------------ */}
                        <div className='col-6'>
                            <ResultOnMap data={data?.classifyKMean} loading={loading} center={center}/>
                        </div>
                        {/* -------------------------------------------Map-End-------------------------------------------- */}


                        {/* -------------------------------------------KMean-Start------------------------------------------ */}
                        <div className='col-6'>
                            <AvailableFiles to='unsupervised'/>
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
                                <div className='col-12 text-center'>
                                    <button onClick={()=>classifyHandler()} className='btn btn-sm btn-success' type='button' disabled={loading}>classify</button>
                                </div>
                            </div>
                        </div>
                        {/* -------------------------------------------KMean-End-------------------------------------------- */}

                    </div>
                </div>
            </div>

        </div>
    </div>

}