import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { DOWNLOAD_IMAGES, GET_PREVIEW } from '../query'
import { downloadImages, mapObj, metadataImage, preview, searchImages } from '../rv'


export const Metadata = () => {
    const metadataImageSub  = useReactiveVar(metadataImage)
    const downloadImagesSub = useReactiveVar(downloadImages)
    const previewSub        = useReactiveVar(preview) as any

    const [downloadImagesQ, {data, loading, error}] = useLazyQuery(DOWNLOAD_IMAGES, {fetchPolicy: "network-only"})

    const download = () => {
        console.log(123)
        console.log(downloadImagesSub)
        downloadImagesQ({
            variables: {
                images: Object.keys(downloadImagesSub).map((key: string) => {
                    return {sceneId: key, sensor: 'LC08', bands: downloadImagesSub[key]}
                })
            }
        })
    }

    

    let LC08_bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11']
    return <div className='row justify-content-start'>
        <div className='col-11 ms-2'>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <button onClick={()=>metadataImage(undefined)} className='btn btn-sm btn-success' type='button'>back to list</button>
                    <button onClick={()=>download()} className='btn btn-sm btn-success' type='button'>go</button>
                    <button onClick={()=>console.log(error)} className='btn btn-sm btn-success' type='button'>error</button>
                    <div className='row justify-content-center'>
                            {
                                LC08_bands.map((band: string, iter: number) => {
                                    return <div className='col-4' key={iter}>
                                        <div className="form-check form-check-inline">
                                            <input className='form-check-input' type={"checkbox"} id={`band-${band}`}
                                                onChange={e => e.target.checked ?
                                                    downloadImages({
                                                        ...downloadImagesSub,
                                                        [metadataImageSub.LANDSAT_SCENE_ID]: 
                                                        downloadImagesSub[metadataImageSub.LANDSAT_SCENE_ID] ? 
                                                        [...downloadImagesSub[metadataImageSub.LANDSAT_SCENE_ID], band] : [band]
                                                    }) 
                                                    : 
                                                    downloadImages({
                                                        ...downloadImagesSub,
                                                        [metadataImageSub.LANDSAT_SCENE_ID]: downloadImagesSub[metadataImageSub.LANDSAT_SCENE_ID].filter((item: string) => item !== band)
                                                    })
                                            }
                                            />
                                            <label className='form-check-label' htmlFor={"band-" + band}>{band}</label>
                                        </div>
                                    </div>
                                })
                            }
                    </div>
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th className="text-center" scope='col' colSpan={2}>Основные методанные</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope='row'>UTM_ZONE</th>
                                <td>{metadataImageSub.UTM_ZONE}</td>
                            </tr>
                            <tr>
                                <th scope='row'>DATE_ACQUIRED</th>
                                <td>{metadataImageSub.DATE_ACQUIRED}</td>
                            </tr>
                            <tr>
                                <th scope='row'>CLOUD_COVER</th>
                                <td>{metadataImageSub.CLOUD_COVER}</td>
                            </tr>
                            <tr>
                                <th scope='row'>CLOUD_COVER_LAND</th>
                                <td>{metadataImageSub.CLOUD_COVER_LAND}</td>
                            </tr>
                            <tr>
                                <th scope='row'>PROCESSING_LEVEL</th>
                                <td>{metadataImageSub.DATA_ACQUIRED}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {/* <div className='row justify-content-center'>
                <div className='col-12 ms-2 mt-2'>
                    <button onClick={()=> getImagePreviewHandler()} className='btn btn-sm btn-success' type='button' disabled={loading2}>getImagePreview</button>
                    <button onClick={()=>console.log(data2, error2)} className='btn btn-sm btn-success' type='button' disabled={loading2}> console getImagePreview</button>
                </div>
            </div> */}
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <label htmlFor="previewOpacity" className="form-label">Прозрачность</label>
                    <input type="range" className="form-range" min="" max="100" defaultValue={100} id="previewOpacity"
                        onChange={e => previewSub.setOpacity(parseInt(e.target.value) / 100) }
                    />
                </div>
            </div>
            <div className='row justify-content-center h-25'>
                <div className='col-12 overflow-auto'>
                    <p className='mt-2 text-center'><b>Все методанные</b></p>
                    {/* <ul>
                        {
                            Object.keys(metadataImageSub).map((key: string, iter: number) => {
                                if(key !== 'system:footprint'){
                                    return <li key={iter}>{key}: <b>{metadataImageSub[key]}</b></li>
                                } else return null
                            })
                        }
                    </ul> */}
                </div>
            </div>

        </div>
    </div>
}