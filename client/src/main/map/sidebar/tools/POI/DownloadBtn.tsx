import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { DOWNLOAD_LANDSAT } from '../../../restMutations'
import { AVAILABLE_FILES } from '../../../restQueries'
import { imagesStack, isLoading, selectedImage, toasts, websocketMessages, ws } from '../../../rv'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'


export const DownloadBtn = () => {
    const imagesStackSub    = useReactiveVar(imagesStack)
    const isLoadingSub: boolean = useReactiveVar(isLoading)
    const selectedImageSub =    useReactiveVar(selectedImage)
    const wsSub = useReactiveVar(ws) as WebSocket
    const websocketMessagesSub = useReactiveVar(websocketMessages)



    React.useEffect(() => {
        if(!wsSub) return
        wsSub.onmessage = (e: any) => {
            const message = JSON.parse(e.data)
            websocketMessages([...websocketMessagesSub, message])
            if(message.operation == 'download-sentinel' || message.operation == 'download-landsat'){
                isLoading(false)
                toasts({[new Date().toLocaleString()]: {
                    header: message.header,
                    message: message.message,
                    show: true,
                    datetime: new Date(message.datetime),
                    color: 'text-bg-success'
                }})
                call1()
                call2()
                call3()
            }
        }
    })

    const [call1] =useLazyQuery(AVAILABLE_FILES, {variables: {to: 'clip'}})
    const [call2] =useLazyQuery(AVAILABLE_FILES, {variables: {to: 'stack'}})
    const [call3] =useLazyQuery(AVAILABLE_FILES, {variables: {to: 'classification'}})

    const download = () => {
        isLoading(true)

        if(imagesStackSub.hasOwnProperty("sentinel")){
            let keys = Object.keys(imagesStackSub.sentinel)
            keys.map(key => {
                wsSub.send(JSON.stringify( {
                        operation: 'download-sentinel',
                        token: `Bearer ${localStorage.getItem("miniGISToken")}`,
                        sentinelMeta: {
                            ...imagesStackSub.sentinel[key].meta
                        },
                        sensor: selectedImageSub.sensor,
                        systemIndex: selectedImageSub.systemIndex,
                        meta: JSON.stringify(selectedImageSub.metadata)
                }))
            })
        }

        if(imagesStackSub.hasOwnProperty("landsat")){
            let keys = Object.keys(imagesStackSub.landsat)
            keys.map(key => {
                // set status loading
                wsSub.send(JSON.stringify( {
                    operation: 'download-landsat',
                    token: `Bearer ${localStorage.getItem("miniGISToken")}`,
                    landsatMeta: {
                        ...imagesStackSub.landsat[key].meta
                    },
                    sensor: selectedImageSub.sensor,
                    systemIndex: selectedImageSub.systemIndex,
                    meta: JSON.stringify(selectedImageSub.metadata)
            }))
            })
        }
    }

    return <button onClick={()=>download()} className='btn btn-sm btn-success' type='button' disabled={isLoadingSub}>Скачать</button>
    

}