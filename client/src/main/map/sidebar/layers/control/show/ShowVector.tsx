import * as React from 'react'
import { layers, selectedVecLay, showToggle } from '../../../../rv'
import { useReactiveVar } from '@apollo/client'
import { VectorInterface } from '../../../../types/main/LayerTypes'



export const ShowVec = ({layerKey}: {layerKey: string}) => {
    const layersSub = useReactiveVar(layers)
    const showToggleSub = useReactiveVar(showToggle)


    const showLayerAttr = (key: string) => {
        selectedVecLay(key)
        showToggle({
            ...showToggleSub,
            DetailVec: true,
            LayerList: false
        })
    }
    

    return <div className='row justify-content-center mb-2'>
        <div className='col-12'>
            <div className="alert alert-info">
                
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
                        <strong>Тип слоя: </strong>{(layersSub[layerKey] as VectorInterface).type}
                    </div>
                    <div className='col-auto'>
                        <strong>Количество фигур: </strong>{Object.keys(layersSub[layerKey].layer._layers).length}
                    </div>
                </div>

            </div>
        </div>
    </div>

}