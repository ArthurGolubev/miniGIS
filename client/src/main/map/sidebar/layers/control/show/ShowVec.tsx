import * as React from 'react'
import { layers, selectedVecLay, showToggle } from '../../../../rv'
import { useReactiveVar } from '@apollo/client'
import * as L from 'leaflet'
import { Shape } from '../../../../types/newTypes'



export const ShowVec = ({layerKey}: {layerKey: string}) => {
    const layersSub = useReactiveVar(layers)
    const showToggleSub = useReactiveVar(showToggle)

    const thisLayer = layersSub[layerKey] as Shape


    const showLayerAttr = (key: string) => {
        selectedVecLay(key),
        showToggle({
            ...showToggleSub,
            DetailVec: true,
            LayerList: false
        })
    }
    

    console.log('thisLayer.layer -> ', thisLayer.layer)
    return <div className='row justify-content-center mb-2'>
        <div className='col-12'>
            <div className="alert alert-primary">
                
                <div className='row justify-content-start mb-2'>
                    <div className='col text-break'>
                        <span><strong><i>{layerKey}</i></strong></span>
                    </div>
                    <div className='col-auto'>
                        <button onClick={()=>showLayerAttr(layerKey)} className='btn btn-sm btn-info' type='button'>
                            <i className="bi bi-pencil"></i>
                        </button>
                    </div>
                </div>

                <div className='row justify-content-between'>
                    <div className='col-auto'>
                        <strong>Тип слоя: </strong>{thisLayer.type}
                    </div>
                    <div className='col-auto'>
                        <strong>Количество фигур: </strong>{Object.keys(thisLayer.layer._layers).length}
                    </div>
                </div>

            </div>
        </div>
    </div>

}