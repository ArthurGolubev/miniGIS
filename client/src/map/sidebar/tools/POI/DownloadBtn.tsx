import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { DOWNLOAD_LANDSAT, DOWNLOAD_SENTINEL } from '../../../query'
import { imagesStack, isLoading, toasts } from '../../../rv'


export const DownloadBtn = () => {
    const imagesStackSub    = useReactiveVar(imagesStack)
    const isLoadingSub: boolean = useReactiveVar(isLoading)

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
                        imagesStack({...imagesStackSub, sentinel: {
                            ...imagesStackSub.sentinel,
                            [key]: {
                                ...imagesStackSub.sentinel[key],
                                status: "downloaded"
                            }
                        }})
                        if(!sentinelLoading && !landsatLoading) isLoading(false)
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
                        if(!sentinelLoading && !landsatLoading) isLoading(false)
                }
                })
            })
        }
    }

    return <button onClick={()=>download()} className='btn btn-sm btn-success' type='button' disabled={isLoadingSub}>Скачать</button>

}