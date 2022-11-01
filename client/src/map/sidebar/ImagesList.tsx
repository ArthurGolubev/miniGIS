import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { GET_PREVIEW } from '../query'
import * as L from 'leaflet'
import { imagePreview, mapObj, metadataImage, preview, searchImages } from '../rv'


export const ImagesList = () => {
    const mapObjSub         = useReactiveVar(mapObj) as any
    const searchImagesSub = useReactiveVar(searchImages)
    
    const [getImagePreview, {data: data2, loading: loading2, error: error2}] = useLazyQuery(GET_PREVIEW)
    const getImagePreviewHandler = (item: any) => {
        console.log('1 ->', item["system:index"])
        console.log('2 ->', searchImagesSub.sensor)
        getImagePreview({variables: {
            systemIndex: item["system:index"],
            sensor: searchImagesSub.sensor
        },
        onCompleted: data => {
            let coordinates = item["system:footprint"]["coordinates"]
            L.geoJSON().addTo(mapObjSub).addData({type: 'LineString', coordinates: coordinates} as any)
            let p = L.imageOverlay(data.getImagePreview, coordinates.map((point: Array<number>) => [point[1], point[0]]) )
            preview(p)
            p.addTo(mapObjSub)
            console.log('SUCCESS ->', data)
            metadataImage(item)
        },
        fetchPolicy: 'network-only',
        onError: e => console.log('error ->', e)
    })
    }

    return <div className='row justify-content-center overflow-auto'>
        <div className='col-12 ' style={{maxHeight: "600px"}}>
            <button onClick={()=>console.log("e ->", error2, "l ->", loading2, "d ->", data2)} className='btn btn-sm btn-primary' type='button'>INFO</button>
            <ul className='mt-1'>
                {
                    searchImagesSub.images.map((item: any, iter: number) => {
                        return <li key={iter} className="mb-1">
                            {/* <div className="d-grid gap-2 col-10 mx-auto">
                                <button className="btn btn-sm btn-outline-primary" onClick={()=>metadataImage(item)}>
                                    {item.DATE_ACQUIRED} Cloud Cover ({item.CLOUD_COVER ?? item.CLOUD_COVERAGE_ASSESSMENT})</button>
                            </div> */}
                            <div className="d-grid gap-2 col-10 mx-auto">
                                <button className="btn btn-sm btn-outline-primary" onClick={()=>getImagePreviewHandler(item)}>
                                    {item.DATE_ACQUIRED} Cloud Cover ({item.CLOUD_COVER ?? item.CLOUD_COVERAGE_ASSESSMENT})</button>
                            </div>
                        </li>
                    })
                }
            </ul>
        </div>
    </div>
}