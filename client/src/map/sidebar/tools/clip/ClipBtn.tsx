import { useLazyQuery, useReactiveVar } from "@apollo/client"
import * as React from "react"
import { CLIP_LAYERS } from "../../../query"
import { isLoading, mapObj, selectedFiles, toasts } from "../../../rv"
import { MapObject } from "../../../types/newTypes"


export const ClipBtn = () => {
    const mapObjSub: MapObject = useReactiveVar(mapObj)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [sendToServer] = useLazyQuery(CLIP_LAYERS, {fetchPolicy: "network-only"})

    const sendHandler = () => {
        let maskArray = mapObjSub.pm.getGeomanLayers().filter((item: any) => item.options?.['opacity'] > 0 || item.options == undefined)
        isLoading(true)
        console.log('debug -> ', maskArray)
        console.log('debug1 -> ', maskArray.map(item => item.toGeoJSON()))
        sendToServer({variables: {
            geoJSONs: maskArray.map(item => item.toGeoJSON()),
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
        },
        })
    }

        return <button onClick={()=>sendHandler()} className='btn btn-sm btn-success' type='button'>CLIP</button>
}