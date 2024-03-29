import * as React from 'react'
import { RasterInterface } from '../../../../types/main/LayerTypes'
import { Open } from './raster/Open'
import { useSidebarToggles } from '../../../../../../interface/stores/SidebarToggles'
import { useLoading } from '../../../../../../interface/stores/Loading'
import { useLayer } from '../../../../../../analysis/stores/layer'
import { useSelectedRasterLay } from '../../../../../../analysis/stores/selecetedRasterLay'


export const DetailRaster = () => {

    const layers = useLayer(state => state.layers)
    const setToggle = useSidebarToggles(state => state.setToggle)
    const [state, setState] = React.useState(false)
    const setLoading = useLoading(state => state.setLoading)
    const isLoading = useLoading(state => state.isLoading)
    const setSelectedRasterLay = useSelectedRasterLay(state => state.setSelectedRasterLay)
    const selectedRasterLay = useSelectedRasterLay(state => state.selectedRasterLay)

    const backToLayerList = () => {
        setSelectedRasterLay(''),
        setToggle({
            DetailRaster: false,
            LayerList: true
        })
    }

    const addBtnHandler = () => {
        setState(true)
        setLoading(true)
    }

    return <div>


        {/* -------------------------------------------Header-Start------------------------------------------ */}
        <div className='row justify-content-center'>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <figure>
                    <blockquote className="blockquote">
                        <div className='row justify-content-center'>
                            <div className='col'>
                                {selectedRasterLay}
                            </div>
                            <div className='col-auto me-3'>
                                <button 
                                onClick={()=>backToLayerList()}
                                className='btn btn-sm btn-light' type='button'>
                                    <i className="bi bi-arrow-left link-primary"></i> back
                                </button>
                            </div>
                        </div>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        {/* <strong>Тип слоя: </strong>{(layersSub[selectedRasterLaySub] as RasterInterface).type ?? 'не назначен'}. */}
                        {/* <span> </span> */}
                        <strong>Количество изображений: </strong>{Object.keys(layers[selectedRasterLay].layer._layers).length}
                    </figcaption>
                </figure>
            </div>
        </div>
        {/* -------------------------------------------Header-End-------------------------------------------- */}


        {/* -------------------------------------------List-Img-Start------------------------------------------ */}
        <div className='row justify-content-center' >
            <div className='col-11'>

                <div className='table-responsive' style={{maxHeight: '45vh'}}>
                    <table className='table table-sm table-bordered table-hover'>
                        <thead>
                            <tr>
                                <th className='text-center'>Info</th>
                                <th className='text-center'>Name</th>
                                {/* <th className='text-center'>Type</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys((layers[selectedRasterLay] as RasterInterface).layer._layers).map((imgId: string) => {
                                    return <tr key={imgId}>
                                        <th className='text-center' onClick={() => console.log('someInfo')}>
                                            <i className="bi bi-info-circle"></i>
                                        </th>
                                        <td className='text-center text-break'>
                                            {(layers[selectedRasterLay] as RasterInterface).imgs[imgId].name}
                                        </td>
                                        {/* <td className='text-center'>
                                            {(layersSub[selectedRasterLaySub] as RasterInterface).imgs[imgId]}
                                        </td> */}
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        {/* -------------------------------------------List-Img-End-------------------------------------------- */}


        {/* -------------------------------------------Add-Img-Start------------------------------------------ */}
        <div className='row justify-content-center'>
            <div className='col-11'>
                <button
                onClick={()=>addBtnHandler()}
                disabled={isLoading}
                className='btn btn-sm btn-success' type='button'>Добавить</button>
            </div>
        </div>

        {
            state && <div className='row justify-content-center mt-2 mb-3'>
                <div className='col-11'>
                    <Open showAddImgMenu={setState}/>
                </div>
            </div>
        }
        
        {/* -------------------------------------------Add-Img-End-------------------------------------------- */}
    </div>
}