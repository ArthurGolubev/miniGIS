import * as React from 'react'
import { RasterInterface } from '../../../../types/main/LayerTypes'
import { useSidebarToggles } from '../../../../../../interface/stores/SidebarToggles'
import { useLayer } from '../../../../../../analysis/stores/layer'
import { useSelectedRasterLay } from '../../../../../../analysis/stores/selecetedRasterLay'



export const ShowRaster = ({layerKey}: {layerKey: string}) => {
    
    const setToggle = useSidebarToggles(state => state.setToggle)
    const layers = useLayer(state => state.layers)
    const setSelectedRasterLay = useSelectedRasterLay(state => state.setSelectedRasterLay)

    const showLayerAttr = (key: string) => {
        setSelectedRasterLay(key)
        setToggle({
            DetailRaster: true,
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
                        <strong>Тип слоя: </strong>{(layers[layerKey] as RasterInterface).layerType}
                    </div>
                    <div className='col-auto'>
                        <strong>Количество изображений: </strong>{Object.keys(layers[layerKey].layer._layers).length}
                    </div>
                </div>

            </div>
        </div>
    </div>

}