import { useLazyQuery, useReactiveVar } from "@apollo/client"
import * as React from "react"
import { CLIP_LAYERS } from "../../../query"
import { isLoading, mapData, selectedFiles } from "../../../rv"


export const ClipBtn = () => {
    const mapDataSub = useReactiveVar(mapData)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [sendToServer] = useLazyQuery(CLIP_LAYERS, {fetchPolicy: "network-only"})

    const send = () => {
        let key = parseInt(Object.keys(mapDataSub)[0])
        isLoading(true)
        sendToServer({variables: {
            geojson: mapDataSub[key].geom,
            files: selectedFilesSub.files.Clip
        }, onCompleted: () => {
            isLoading(false)
        }})
    }

        return <button onClick={()=>send()} className='btn btn-sm btn-success' type='button'>CLIP</button>
}