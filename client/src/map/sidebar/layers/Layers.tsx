import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { layers } from '../../rv'
import { MapLayers } from '../../types/newTypes'
import { AttributeTable } from './attributeTable/AttributeTable'


export const Layers = () => {
    const layersSub: MapLayers = useReactiveVar(layers)

    return <div>
        <div className='row justify-content-center'>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <AttributeTable mapLayers={layersSub}/>
            </div>

        </div>
    </div>
}