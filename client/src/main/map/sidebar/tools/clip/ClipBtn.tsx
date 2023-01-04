import { useLazyQuery, useMutation, useReactiveVar } from "@apollo/client"
import * as React from "react"
import { CLIP_TO_MASK } from "../../../mutations"
import { AVAILABLE_FILES } from "../../../queries"
import { clipMask, isLoading, mapObj, selectedFiles, toasts, tools } from "../../../rv"
import { MapObject } from "../../../types/main/MapTypes"


export const ClipBtn = () => {
    const mapObjSub: MapObject = useReactiveVar(mapObj)
    const toolsSub = useReactiveVar(tools)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [sendToServer] = useMutation(CLIP_TO_MASK, {fetchPolicy: "network-only"})
    const clipMaskSub = useReactiveVar(clipMask)
    const isLoadingSub = useReactiveVar(isLoading)

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
        refetchQueries: [
            {query: AVAILABLE_FILES, variables: {to: 'Clip'}},
            {query: AVAILABLE_FILES, variables: {to: 'Stack'}},
            {query: AVAILABLE_FILES, variables: {to: 'Classification'}},
        ]
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