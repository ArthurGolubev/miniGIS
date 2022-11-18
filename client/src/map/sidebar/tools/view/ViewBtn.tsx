import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { AVAILABLE_FILES, GET_CLASSIFICATION_LAYER } from '../../../query'
import { mapObj, selectedFiles, tools, test } from '../../../rv'
import * as L from 'leaflet'


export const ViewBtn = () => {
    const toolsSub = useReactiveVar(tools)
    const {data, loading} = useQuery(AVAILABLE_FILES, {variables: {to: toolsSub.show}})
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const mapObjSub         = useReactiveVar(mapObj) as any
    const testSub = useReactiveVar(test) as any
    const [getClassificationLayer] = useLazyQuery(GET_CLASSIFICATION_LAYER)


    const se = () => {
        // Тут делается запросик на получения координат из .tif и получения правильной (полной) ссылки на .png
        // делается это в onCompleted
        getClassificationLayer({
            variables: {filePath: selectedFilesSub.files.View[0]},
            onCompleted: data => {
                let coordinates = data.getClassificationLayer.coordinates
                let imgUrl = data.getClassificationLayer.imgUrl
                console.log("TEST ->", testSub)
                L.geoJSON().addTo(mapObjSub).addData({type: 'LineString', coordinates: coordinates} as any)
                // let p = L.imageOverlay(selectedFilesSub.files?.View[0], coordinates.map((point: Array<number>) => [point[1], point[0]]) )
                let p = L.imageOverlay(imgUrl, coordinates.map((point: Array<number>) => [point[1], point[0]]) )
                // preview(p)
                p.addTo(mapObjSub)
            }
        })
        // selectedImage(metadata)
    }


    return <div className='row justify-content-center'>
        <div className='col-4'>
            <button onClick={()=>console.log(data)} className='btn btn-sm btn-success' type='button'>data</button>
            { selectedFilesSub.files?.View.length != undefined && <img src={ selectedFilesSub.files?.View[0] } /> }
            {/* <img src='images/test.png' /> */}
            <button onClick={()=>se()} className='btn btn-sm btn-success' type='button'>btn</button>
        </div>
    </div>
}