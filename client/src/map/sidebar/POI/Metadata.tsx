import * as React from 'react'
import { useLazyQuery, useReactiveVar } from '@apollo/client'
import { DOWNLOAD_LANDSAT, DOWNLOAD_SENTINEL } from '../../query'
import { selectedImage, preview, searchImages, bands, imagesStack, toasts, isLoading } from '../../rv'


export const Metadata = () => {
    const selectedImageSub  = useReactiveVar(selectedImage)
    const searchImagesSub   = useReactiveVar(searchImages)
    const imagesStackSub    = useReactiveVar(imagesStack)
    const isLoadingSub      = useReactiveVar(isLoading)
    const previewSub        = useReactiveVar(preview) as any

    const [downloadSentinel, {loading: sentinelLoading}] = useLazyQuery(DOWNLOAD_SENTINEL, {fetchPolicy: "network-only"})
    const [downloadLandsat, {loading: landsatLoading}] = useLazyQuery(DOWNLOAD_LANDSAT, {fetchPolicy: "network-only"})

    const download = () => {
        console.log(123)
        console.log(imagesStackSub)
        isLoading(true)

        if(imagesStackSub.hasOwnProperty("sentinel")){
            let keys = Object.keys(imagesStackSub.sentinel)
            keys.map(key => {
                // set status loading
                imagesStack({...imagesStackSub, sentinel: {
                    ...imagesStackSub.sentinel,
                    [key]: {
                        ...imagesStackSub.sentinel[key],
                        status: "loading"
                    }
                }})
                downloadSentinel({
                    variables: {
                        sentinelMeta: {
                            ...imagesStackSub.sentinel[key].meta
                        }
                    },
                    onCompleted: data => {
                        toasts({[key]: {
                            header: data.downloadSentinel.header,
                            message: data.downloadSentinel.message,
                            show: true,
                            datetime: new Date(data.downloadSentinel.datetime)
                        }})
                        // set status downloaded
                        imagesStack({...imagesStackSub, sentinel: {
                            ...imagesStackSub.sentinel,
                            [key]: {
                                ...imagesStackSub.sentinel[key],
                                status: "downloaded"
                            }
                        }})
                        if(sentinelLoading && landsatLoading) isLoading(false)
                }
                })
            })
        }

        if(imagesStackSub.hasOwnProperty("landsat")){
            let keys = Object.keys(imagesStackSub.landsat)
            keys.map(key => {
                // set status loading
                imagesStack({...imagesStackSub, landsat: {
                    ...imagesStackSub.sentinel,
                    [key]: {
                        ...imagesStackSub.landsat[key],
                        status: "loading"
                    }
                }})
                downloadLandsat({
                    variables: {
                        landsatMeta: {
                            ...imagesStackSub.landsat[key].meta
                        }
                    },
                    onCompleted: data => {
                        toasts({[key]: {
                            header: data.downloadLandsat.header,
                            message: data.downloadLandsat.message,
                            show: true,
                            datetime: new Date(data.downloadLandsat.datetime)
                        }})
                        // set status downloaded
                        imagesStack({...imagesStackSub, sentinel: {
                            ...imagesStackSub.sentinel,
                            [key]: {
                                ...imagesStackSub.sentinel[key],
                                status: "downloaded"
                            }
                        }})
                        if(sentinelLoading && landsatLoading) isLoading(false)
                }
                })
            })
        }
    }




    const bandsHandler = (isChecked: boolean, band: string) => {
        let satellite: "sentinel" | "landsat"
        let date
        let exist
        let bands
        let info

        if(searchImagesSub.sensor === 'S2'){
            // SENTINEL
            satellite = 'sentinel'
            date = new Date(selectedImageSub.GENERATION_TIME).toISOString().slice(0, 10)
            exist = !!imagesStackSub.sentinel?.[date]
            info = {
                mgrsTile: selectedImageSub.MGRS_TILE,
                productId: selectedImageSub.PRODUCT_ID,
                granuleId: selectedImageSub.GRANULE_ID,
                bands: []
            }
        } else {
            // LANDSAT
            satellite = 'landsat'
            date = selectedImageSub.DATE_ACQUIRED
            exist = !!imagesStackSub.landsat?.[date]
            info = {
                sensorId: searchImagesSub.sensor,
                path: String(selectedImageSub.WRS_PATH),
                row: String(selectedImageSub.WRS_ROW),
                productId: selectedImageSub.LANDSAT_PRODUCT_ID,
                bands: []
            }
        }

        if(exist){
            // если такой объект уже существеут, то взять его бенды
            bands = imagesStackSub[satellite][date].meta.bands
            // добавить или убрать слой
            isChecked ? bands.push(band) : bands = bands.filter(b => b != band)
            // обновить банды
            info.bands = bands
        } else {
            // если нету, то создать
            info.bands = [band,]
        }
        
        imagesStack({
            ...imagesStackSub,
            [satellite]: {
                ...imagesStackSub[satellite],
                [date]: {
                    meta: {
                        ...info
                    },
                    status: 'wait'
                }
            }
        })
    }



    const getSattelliteBands = () => {
        console.log('searchImagesSub.sensor ->', searchImagesSub.sensor)
        switch (searchImagesSub.sensor) {
            case 'S2':
                console.log('S2')
                return bands.sentinel2
            case 'LC09':
                console.log('LC09')
                return bands.landsat8and9
            case 'LC08':
                console.log('LC08')
                return bands.landsat8and9
            case 'LC07':
                console.log('LC07')
                return bands.landsat7
            case 'LC05':
                console.log('LC05')
                return bands.landsat4and5
            case 'LC04':
                console.log('LC04')
                return bands.landsat4and5
            default:
                console.log('DEFAULT case from Metadata.tsx')
                break;
        }
    }


    return <div className='row justify-content-start'>
        <div className='col-11 ms-2'>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <button onClick={()=>selectedImage(undefined)} className='btn btn-sm btn-success' type='button'>back to list</button>
                    <button onClick={()=>download()} className='btn btn-sm btn-success' type='button' disabled={isLoadingSub}>Скачать</button>
                    <div className='row justify-content-center'>
                            {
                                getSattelliteBands().map((band: string, iter: number) => {
                                    return <div className='col-4' key={iter}>
                                        <div className="form-check form-check-inline">
                                            <input className='form-check-input' type={"checkbox"} id={`band-${band}`} defaultChecked={false}
                                                onChange={e => bandsHandler(e.target.checked, band) }
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
                                <td>{selectedImageSub.UTM_ZONE}</td>
                            </tr>
                            <tr>
                                <th scope='row'>DATE_ACQUIRED</th>
                                <td>{selectedImageSub.DATE_ACQUIRED}</td>
                            </tr>
                            <tr>
                                <th scope='row'>CLOUD_COVER</th>
                                <td>{selectedImageSub.CLOUD_COVER}</td>
                            </tr>
                            <tr>
                                <th scope='row'>CLOUD_COVER_LAND</th>
                                <td>{selectedImageSub.CLOUD_COVER_LAND}</td>
                            </tr>
                            <tr>
                                <th scope='row'>PROCESSING_LEVEL</th>
                                <td>{selectedImageSub.DATA_ACQUIRED}</td>
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