import * as React from 'react'
import { NewVec } from './NewVec'
import { OpenVec } from './OpenVec'



export const Vec = ({showLayerAddControl}: {showLayerAddControl: (p: boolean) => void}) => {
    const [state, setState] = React.useState(undefined)

    return <div className='row justify-content-center mt-2 mb-2'>
        <div className='col-12'>

            <div className='row justify-content-center'>
                <div className='col-auto'>
                    <div className='btn-group'>
                        <button onClick={()=>setState('open')} className='btn btn-sm btn-success' type='button'>Открыть</button>
                        <button onClick={()=>setState('create')} className='btn btn-sm btn-success' type='button'>Создать</button>
                    </div>
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    {state == 'open' && <OpenVec showLayerAddControl={showLayerAddControl} />}
                    {state == 'create' && <NewVec showLayerAddControl={showLayerAddControl} />}
                </div>
            </div>
            
        </div>
    </div>
}
