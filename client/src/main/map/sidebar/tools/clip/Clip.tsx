import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { layers } from '../../../rv'
import { MapLayers } from '../../../types/main/LayerTypes'
import { AvailableFiles } from '../AvailableFiles'
import { ClipBtn } from './ClipBtn'


export const Clip = () => {
    const layersSub: MapLayers = useReactiveVar(layers)
    const shapes: MapLayers = {}
    Object.entries(layersSub).sort((a: any, b: any) => b[1].positionInTable - a[1].positionInTable).forEach((item: [string, any])=> {
            if(layersSub[item[0]].layerType == 'vector') shapes[item[0]] = layersSub[item[0]]
        })

    return <div className='row justify-content-center'>
        <AvailableFiles to='clip'/>
        <ClipBtn />
    </div>
}