import { useLazyQuery, useReactiveVar } from "@apollo/client"
import * as React from "react"
import { CLIP_LAYERS } from "../../../query"
import { isLoading, mapObj, selectedFiles } from "../../../rv"
import { MapObject } from "../../../types/newTypes"


export const ClipBtn = () => {
    const mapObjSub: MapObject = useReactiveVar(mapObj)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [sendToServer] = useLazyQuery(CLIP_LAYERS, {fetchPolicy: "network-only"})

    const sendHandler = () => {
        let maskArray = mapObjSub.pm.getGeomanLayers().filter((item: any) => item.options?.['opacity'] > 0 || item.options == undefined)
        isLoading(true)
        sendToServer({variables: {
            geoJSONs: maskArray.map(item => item.toGeoJSON()),
            files: selectedFilesSub.files.Clip
        }, onCompleted: () => {
            isLoading(false)
        }})
    }

        return <button onClick={()=>sendHandler()} className='btn btn-sm btn-success' type='button'>CLIP</button>
}