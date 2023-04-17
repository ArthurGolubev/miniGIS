import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { imagesStack, isLoading, selectedImage } from '../../../rv'
import { socket } from '../../../../../app/socket'


export const DownloadBtn = () => {
    const imagesStackSub    = useReactiveVar(imagesStack)
    const isLoadingSub: boolean = useReactiveVar(isLoading)
    const selectedImageSub =    useReactiveVar(selectedImage)


    const download = () => {
        isLoading(true)

        if(imagesStackSub.hasOwnProperty("sentinel")){
            let keys = Object.keys(imagesStackSub.sentinel)
            keys.map(key => {
                socket.emit(
                    "download-sentinel",
                    {
                        sentinelMeta: {
                            ...imagesStackSub.sentinel[key].meta
                        },
                        sensor: selectedImageSub.sensor,
                        systemIndex: selectedImageSub.systemIndex,
                        meta: JSON.stringify(selectedImageSub.metadata)
                    },
                )
            })
        }

        if(imagesStackSub.hasOwnProperty("landsat")){
            let keys = Object.keys(imagesStackSub.landsat)
            keys.map(key => {
                socket.emit(
                    "download-landsat",
                    {
                        landsatMeta: {
                            ...imagesStackSub.landsat[key].meta
                        },
                        sensor: selectedImageSub.sensor,
                        systemIndex: selectedImageSub.systemIndex,
                        meta: JSON.stringify(selectedImageSub.metadata)
                    },
                )
            })
        }
    }

    return <button onClick={()=>download()} className='btn btn-sm btn-success' type='button' disabled={isLoadingSub}>Скачать</button>
    

}