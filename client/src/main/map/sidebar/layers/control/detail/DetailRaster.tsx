import * as React from 'react'
import { useReactiveVar } from '@apollo/client'
import { isLoading, layers, selectedRasterLay, showToggle } from '../../../../rv'
import { RasterInterface } from '../../../../types/main/LayerTypes'
import { Open } from './raster/Open'


export const DetailRaster = () => {
    const [state, setState] = React.useState(false)
    const layersSub = useReactiveVar(layers)
    const showToggleSub = useReactiveVar(showToggle)
    const selectedRasterLaySub = useReactiveVar(selectedRasterLay)
    const isLoadingSub = useReactiveVar(isLoading)

    const backToLayerList = () => {
        selectedRasterLay(''),
        showToggle({
            ...showToggleSub,
            DetailRaster: false,
            LayerList: true
        })
    }

    const addBtnHandler = () => {
        setState(true)
        isLoading(true)
    }

    return <div>


        {/* -------------------------------------------Header-Start------------------------------------------ */}
        <div className='row justify-content-center'>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <figure>
                    <blockquote className="blockquote">
                        <div className='row justify-content-center'>
                            <div className='col'>
                                {selectedRasterLaySub}
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
                        <strong>Количество изображений: </strong>{Object.keys(layersSub[selectedRasterLaySub].layer._layers).length}
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
                                Object.keys((layersSub[selectedRasterLaySub] as RasterInterface).layer._layers).map((imgId: string) => {
                                    return <tr key={imgId}>
                                        <th className='text-center' onClick={() => console.log('someInfo')}>
                                            <i className="bi bi-info-circle"></i>
                                        </th>
                                        <td className='text-center text-break'>
                                            {(layersSub[selectedRasterLaySub] as RasterInterface).imgs[imgId].name}
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
                disabled={isLoadingSub}
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