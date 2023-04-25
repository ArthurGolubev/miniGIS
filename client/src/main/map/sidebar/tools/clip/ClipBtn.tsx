import { useReactiveVar } from "@apollo/client"
import * as React from "react"
import { clipMask, isLoading, mapObj, selectedFiles, toasts, tools} from "../../../rv"
import { MapObject } from "../../../types/main/MapTypes"
import { useLocation } from "react-router"
import { socket } from "../../../../../app/socket"


export const ClipBtn = () => {
    const mapObjSub: MapObject = useReactiveVar(mapObj)
    const toolsSub = useReactiveVar(tools)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const clipMaskSub = useReactiveVar(clipMask)
    const isLoadingSub = useReactiveVar(isLoading)
    let location = useLocation()




    const sendHandler = () => {
        isLoading(true)
        socket.emit(
            "clip-to-mask",
            {
                mask: clipMaskSub.mask,
                files: selectedFilesSub.files[location.pathname]
            },
        )
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
                {
                    location.pathname == '/main/map/workflow/clip' && (
                        <div className='col-6 text-center'>
                            <button 
                            onClick={()=>sendHandler()}
                            className='btn btn-sm btn-success'
                            type='button'
                            disabled={!(clipMaskSub.layer != undefined) || isLoadingSub}
                            >CLIP</button>
                        </div>
                    )
                }
            </div>
        </div>
    </div>
}