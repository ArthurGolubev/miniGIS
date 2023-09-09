import * as React from 'react'
import { MapLayers } from '../../../types/main/LayerTypes'
import { AvailableFiles } from '../AvailableFiles'
import { ClipBtn } from './ClipBtn'
import { useLayer } from '../../../../../analysis/stores/layer'


export const Clip = () => {
    const layers = useLayer(state => state.layers)
    const shapes: MapLayers = {}
    Object.entries(layers).sort((a: any, b: any) => b[1].positionInTable - a[1].positionInTable).forEach((item: [string, any])=> {
            if(layers[item[0]].layerType == 'vector') shapes[item[0]] = layers[item[0]]
        })

    return <div className='row justify-content-center'>
        <AvailableFiles to='clip'/>
        <ClipBtn />
    </div>
}