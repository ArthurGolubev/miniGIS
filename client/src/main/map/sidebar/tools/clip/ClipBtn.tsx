import * as React from "react"
import { useLocation } from "react-router"
import { socket } from "../../../../../app/socket"
import { useToolsToggles } from "../../../../../analysis/stores/toolsToggles"
import { useLoading } from "../../../../../interface/stores/Loading"
import { useSelectedFiles } from "../../../../../analysis/stores/selectedFiles"
import { useClipMask } from "../../../../../analysis/stores/clipMask"
import { useMapObject } from "../../../../../analysis/stores/MapObject"


export const ClipBtn = () => {
    const files = useSelectedFiles(state => state.files)
    const showTools = useToolsToggles(state => state.showTools)
    let location = useLocation()
    const isLoading = useLoading(state => state.isLoading)
    const setLoading = useLoading(state => state.setLoading)
    const mask = useClipMask(state => state.mask)
    const layer = useClipMask(state => state.layer)
    const mapObject = useMapObject(state => state)





    const sendHandler = () => {
        setLoading(true)
        socket.emit(
            "clip-to-mask",
            {
                mask: mask,
                files: files[location.pathname]
            },
        )
    }


    const drawMaskHandler = () => {
        showTools({mask: true})
        mapObject.pm.enableDraw('Polygon', {continueDrawing: false, pathOptions: {color: 'red'}})
    }


    return <div className='row justify-content-center'>
        <div className='col-11'>
            
            <div className='row justify-content-center'>
                <div className='col text-center mt-1'>
                    <button 
                    onClick={()=>drawMaskHandler()}
                    disabled={isLoading}
                    className='btn btn-sm btn-success' type='button'>
                        нарисовать
                    </button>
                </div>
                {
                    location.pathname == '/main/map/workflow/clip' && (
                        <div className='col-6 text-center'>
                            <button 
                            onClick={()=>sendHandler()}
                            className='btn btn-sm btn-success'
                            type='button'
                            disabled={!(layer != undefined) || isLoading}
                            >Вырезать</button>
                        </div>
                    )
                }
            </div>
        </div>
    </div>
}