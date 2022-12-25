import * as React from 'react'
import { d1 } from '../../../../rv'
import { Raster } from '../newLayer/raster/Raster'
import { NewVec } from '../newLayer/vec/NewVec'
import { OpenVec } from '../newLayer/vec/OpenVec'
import { Vec } from '../newLayer/vec/Vec'


export const LayerAddControl = () => {
    const [state, setState] = React.useState(undefined)



    return <div className='row justify-content-center mb-2 mt-2'>
        <div className='col-12'>
            
            <div className='row justify-content-center'>
                <div className='col-auto'>
                    <div className="dropdown">
                        <button className='btn btn-sm btn-primary dropdown-toggle' type='button' data-bs-toggle="dropdown" aria-expanded="false">
                            Создать слой
                        </button>
                        <ul className='dropdown-menu'>
                            <li>
                                <button onClick={()=>setState('vec')}  className='dropdown-item' type='button'>Векторный</button>
                            </li>
                            <li>
                                <button onClick={()=>setState('raster')}  className='dropdown-item' type='button'>Растровый</button>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    {state == 'vec' && <Vec showLayerAddControl={setState} />}
                    {state == 'raster' && <Raster showLayerAddControl={setState} />}
                </div>
            </div>

            
        </div>
    </div>
}