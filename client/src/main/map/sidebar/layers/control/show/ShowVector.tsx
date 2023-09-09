import * as React from 'react'
import { VectorInterface } from '../../../../types/main/LayerTypes'
import { useSidebarToggles } from '../../../../../../interface/stores/SidebarToggles'
import { useLayer } from '../../../../../../analysis/stores/layer'
import { useSelectedVecLay } from '../../../../../../analysis/stores/selectedVecLay'



export const ShowVec = ({layerKey}: {layerKey: string}) => {

    const setToggle = useSidebarToggles(state => state.setToggle)
    const show = useSidebarToggles(state => state.show)
    const layers = useLayer(state => state.layers)
    const setSelectedVecLay = useSelectedVecLay(state => state.setSelectedVecLay)

    const showLayerAttr = (key: string) => {
        setSelectedVecLay(key)
        setToggle({
            ...show,
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
                        <strong>Тип слоя: </strong>{(layers[layerKey] as VectorInterface).type}
                    </div>
                    <div className='col-auto'>
                        <strong>Количество фигур: </strong>{Object.keys(layers[layerKey].layer._layers).length}
                    </div>
                </div>

            </div>
        </div>
    </div>

}