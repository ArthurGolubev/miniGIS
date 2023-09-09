import * as React from 'react'
import { socket } from '../../../../../app/socket'
import { useLoading } from '../../../../../interface/stores/Loading'
import { useImagesStack } from '../../../../../analysis/stores/imagesStack'
import { useSelectedImage } from '../../../../../analysis/stores/selectedImage'


export const DownloadBtn = () => {
    const setLoading = useLoading(state => state.setLoading)
    const isLoading = useLoading(state => state.isLoading)
    const sentinel = useImagesStack(state => state.sentinel)
    const landsat = useImagesStack(state => state.landsat)
    const sensor = useSelectedImage(state => state.sensor)
    const systemIndex = useSelectedImage(state => state.systemIndex)
    const metadata = useSelectedImage(state => state.metadata)

    const download = () => {
        setLoading(true)

        if(sentinel){
            let keys = Object.keys(sentinel)
            keys.map(key => {
                socket.emit(
                    "download-sentinel",
                    {
                        sentinelMeta: {
                            ...sentinel[key].meta
                        },
                        sensor: sensor,
                        systemIndex: systemIndex,
                        meta: JSON.stringify(metadata)
                    },
                )
            })
        }

        if(landsat){
            let keys = Object.keys(landsat)
            keys.map(key => {
                socket.emit(
                    "download-landsat",
                    {
                        landsatMeta: {
                            ...landsat[key].meta
                        },
                        sensor: sensor,
                        systemIndex: systemIndex,
                        meta: JSON.stringify(metadata)
                    },
                )
            })
        }
    }

    return <button onClick={()=>download()} className='btn btn-sm btn-success' type='button' disabled={isLoading}>Скачать</button>
    

}