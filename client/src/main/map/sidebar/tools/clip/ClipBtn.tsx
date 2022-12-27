import { useLazyQuery, useReactiveVar } from "@apollo/client"
import * as React from "react"
import { CLIP_LAYERS } from "../../../query"
import { clipMask, isLoading, mapObj, selectedFiles, toasts, tools } from "../../../rv"
import { MapObject } from "../../../types/newTypes"


export const ClipBtn = () => {
    const mapObjSub: MapObject = useReactiveVar(mapObj)
    const toolsSub = useReactiveVar(tools)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [sendToServer] = useLazyQuery(CLIP_LAYERS, {fetchPolicy: "network-only"})
    const clipMaskSub = useReactiveVar(clipMask)

    const sendHandler = () => {
        // let maskArray = mapObjSub.pm.getGeomanLayers().filter((item: any) => item.options?.['opacity'] > 0 || item.options == undefined)
        isLoading(true)
        // console.log('debug -> ', maskArray)
        // console.log('debug1 -> ', maskArray.map(item => item.toGeoJSON()))
        sendToServer({variables: {
            // geoJSONs: maskArray.map(item => item.toGeoJSON()),
            geoJSONs: clipMaskSub.mask,
            files: selectedFilesSub.files.Clip
        },
        onCompleted: data => {
            toasts({[new Date().toLocaleString()]: {
                header: data.clipToMask.header,
                message: data.clipToMask.message,
                show: true,
                datetime: new Date(data.clipToMask.datetime),
                color: 'text-bg-success'
            }})
            isLoading(false)
            tools({...toolsSub, setMask: false})
        },
        })
    }


    const drawMaskHandler = () => {
        tools({...toolsSub, setMask: true})
        mapObjSub.pm.enableDraw('Polygon', {continueDrawing: false, pathOptions: {color: 'red'}})
    }


    return <div className='row justify-content-center'>
        <div className='col-11'>
            
            <div className='row justify-content-center'>
                <div className='col-6 text-center'>
                    <button onClick={()=>drawMaskHandler()} className='btn btn-sm btn-success' type='button'>draw</button>
                </div>
                <div className='col-6 text-center'>
                    <button 
                    onClick={()=>sendHandler()}
                    className='btn btn-sm btn-success'
                    type='button'
                    disabled={!(clipMaskSub.layer != undefined)}
                    >CLIP</button>
                </div>
            </div>


        </div>
    </div>
}