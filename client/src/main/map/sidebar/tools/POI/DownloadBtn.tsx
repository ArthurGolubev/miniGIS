import { useMutation, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { DOWNLOAD_LANDSAT } from '../../../restMutations'
import { DOWNLOAD_SENTINEL } from '../../../restMutations'
import { AVAILABLE_FILES } from '../../../restQueries'
import { imagesStack, isLoading, selectedImage, toasts } from '../../../rv'


export const DownloadBtn = () => {
    const imagesStackSub    = useReactiveVar(imagesStack)
    const isLoadingSub: boolean = useReactiveVar(isLoading)
    const selectedImageSub =    useReactiveVar(selectedImage)

    const [downloadSentinel, {loading: sentinelLoading}] = useMutation(DOWNLOAD_SENTINEL, {fetchPolicy: "network-only"})
    const [downloadLandsat, {loading: landsatLoading}] = useMutation(DOWNLOAD_LANDSAT, {fetchPolicy: "network-only"})


    const download = () => {
        console.log(123)
        console.log(imagesStackSub)
        console.log('selectedImageSub -> ', selectedImageSub.sensor)
        isLoading(true)

        if(imagesStackSub.hasOwnProperty("sentinel")){
            let keys = Object.keys(imagesStackSub.sentinel)
            keys.map(key => {
                imagesStack({...imagesStackSub, sentinel: {
                    ...imagesStackSub.sentinel,
                    [key]: {
                        ...imagesStackSub.sentinel[key],
                        status: "loading"
                    }
                }})
                downloadSentinel({
                    variables: {
                        input: {
                            sentinelMeta: {
                                ...imagesStackSub.sentinel[key].meta
                            },
                            sensor: selectedImageSub.sensor,
                            systemIndex: selectedImageSub.systemIndex,
                            meta: JSON.stringify(selectedImageSub.metadata)
                        }
                    },
                    onCompleted: data => {
                        toasts({[new Date().toLocaleString()]: {
                            header: data.downloadSentinel.header,
                            message: data.downloadSentinel.message,
                            show: true,
                            datetime: new Date(data.downloadSentinel.datetime),
                            color: 'text-bg-success'

                        }})
                        imagesStack({...imagesStackSub, sentinel: {
                            ...imagesStackSub.sentinel,
                            [key]: {
                                ...imagesStackSub.sentinel[key],
                                status: "downloaded"
                            }
                        }})
                        if(!sentinelLoading && !landsatLoading) isLoading(false)
                    },
                    refetchQueries: [
                        {query: AVAILABLE_FILES, variables: {to: 'Clip'}},
                        {query: AVAILABLE_FILES, variables: {to: 'Stack'}},
                        {query: AVAILABLE_FILES, variables: {to: 'Classification'}},
                    ]
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
                        input: {
                            landsatMeta: {
                                ...imagesStackSub.landsat[key].meta
                            },
                            sensor: selectedImageSub.sensor,
                            systemIndex: selectedImageSub.systemIndex,
                            meta: JSON.stringify(selectedImageSub.metadata)
                        }
                    },
                    onCompleted: data => {
                        toasts({[new Date().toLocaleString()]: {
                            header: data.downloadLandsat.header,
                            message: data.downloadLandsat.message,
                            datetime: new Date(data.downloadLandsat.datetime),
                            show: true,
                            color: 'text-bg-success'
                        }})
                        // set status downloaded
                        imagesStack({...imagesStackSub, landsat: {
                            ...imagesStackSub.landsat,
                            [key]: {
                                ...imagesStackSub.landsat[key],
                                status: "downloaded"
                            }
                        }})
                        if(!landsatLoading && !sentinelLoading) isLoading(false)
                    },
                    refetchQueries: [
                        {query: AVAILABLE_FILES, variables: {to: 'Clip'}},
                        {query: AVAILABLE_FILES, variables: {to: 'Stack'}},
                        {query: AVAILABLE_FILES, variables: {to: 'Classification'}},
                    ]
                })
            })
        }
    }

    return <button onClick={()=>download()} className='btn btn-sm btn-success' type='button' disabled={isLoadingSub}>Скачать</button>

}