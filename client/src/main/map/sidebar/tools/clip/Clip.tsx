import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { layers } from '../../../rv'
import { MapLayers } from '../../../types/newTypes'
import { AvailableFiles } from '../AvailableFiles'
import { ClipBtn } from './ClipBtn'


export const Clip = () => {
    const layersSub: MapLayers = useReactiveVar(layers)
    const shapes: MapLayers = {}
    Object.entries(layersSub).sort((a: any, b: any) => b[1].positionInTable - a[1].positionInTable).forEach((item: [string, any])=> {
            if(layersSub[item[0]].layerType == 'shape') shapes[item[0]] = layersSub[item[0]]
        })

    return <div className='row justify-content-center'>
        <AvailableFiles />
        <div className='col-11'>
            <div className='alert alert-primary'>В данным момент вырезка проходит только по первому полигону в списке c opacity &gt; 0</div>
        </div>
        {/* <AttributeTable mapLayers={shapes}/> */}
        <ClipBtn />
    </div>
}