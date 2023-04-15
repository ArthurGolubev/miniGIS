import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client"
import * as React from "react"
import { CLIP_TO_MASK } from "../../../restMutations"
import { AVAILABLE_FILES } from "../../../restQueries"
import { clipMask, isLoading, mapObj, selectedFiles, toasts, tools, websocketMessages, ws } from "../../../rv"
import { MapObject } from "../../../types/main/MapTypes"
import { useLocation } from "react-router"


export const ClipBtn = () => {
    const mapObjSub: MapObject = useReactiveVar(mapObj)
    const toolsSub = useReactiveVar(tools)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    // const [sendToServer] = useMutation(CLIP_TO_MASK, {fetchPolicy: "network-only"})
    const clipMaskSub = useReactiveVar(clipMask)
    const isLoadingSub = useReactiveVar(isLoading)
    const wsSub = useReactiveVar(ws) as any
    const websocketMessagesSub = useReactiveVar(websocketMessages)
    let location = useLocation()


    React.useEffect(() => {
        if(!wsSub) return
        wsSub.onmessage = (e: any) => {
            console.log('123')
            const message = JSON.parse(e.data)
            console.log('message -> ', message)
            websocketMessages([...websocketMessagesSub, message])
            if(message.operation == 'clip-to-mask'){
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

    const sendHandler = () => {
        isLoading(true)
        wsSub.send(JSON.stringify({
            operation: 'clip-to-mask',
            token: `Bearer ${localStorage.getItem("miniGISToken")}`,
            mask: clipMaskSub.mask,
            files: selectedFilesSub.files[location.pathname]
        }))
    }


    const drawMaskHandler = () => {
        tools({...toolsSub, setMask: true})
        mapObjSub.pm.enableDraw('Polygon', {continueDrawing: false, pathOptions: {color: 'red'}})
    }


    return <div className='row justify-content-center'>
        <div className='col-11'>
            
            <div className='row justify-content-center'>
                <div className='col-6 text-center'>
                    <button 
                    onClick={()=>drawMaskHandler()}
                    disabled={isLoadingSub}
                    className='btn btn-sm btn-success' type='button'>draw</button>
                </div>
                <div className='col-6 text-center'>
                    <button 
                    onClick={()=>sendHandler()}
                    className='btn btn-sm btn-success'
                    type='button'
                    disabled={!(clipMaskSub.layer != undefined) || isLoadingSub}
                    >CLIP</button>
                </div>
            </div>
        </div>
    </div>
}