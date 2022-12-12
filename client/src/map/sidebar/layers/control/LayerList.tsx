import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { layers } from '../../../rv'
import { NewVec } from './NewVec'
import { ShowPrev } from './show/ShowPrev'
import { ShowResult } from './show/ShowResult'
import { ShowVec } from './show/ShowVec'


export const LayerList = () => {
    const [state, setState] = React.useState(false)
    const layersSub = useReactiveVar(layers)

    return <div>

        
        <div className='row justify-content-center'>
            <div className='col-11'>

                <div className='row justify-content-center mt-2 mb-2 ms-2'>
                    <div className='col-auto'>
                        <div className="btn-group">
                            <button onClick={()=>console.log('open')} className='btn btn-sm btn-success' type='button'>Открыть слой</button>
                            <div className='btn-group'>
                                <button className='btn btn-sm btn-primary' type='button' onClick={() => setState(true)}>
                                    Создать слой
                                </button>
                            </div>
                        </div>
                    </div>
                </div>        


                {state && <NewVec show={setState}/>}

                {
                    Object.keys(layersSub).map((key: string) => {
                        switch (layersSub[key].layerType) {
                            case 'preview':
                                return <ShowPrev key={key} />
                            case 'shape':
                                return <ShowVec key={key} layerKey={key}/>
                            case 'result':
                                return <ShowResult key={key} />
                            default:
                                console.log("DEFAULT case from Layers.tsx ", layersSub[key].layerType)
                                break;
                        }
                    })
                }
            </div>

        </div>
        
    </div>
}