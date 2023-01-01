import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { layers } from '../../../../rv'
import { ShowRaster } from '../show/ShowRaster'
import { ShowVec } from '../show/ShowVector'


export const LayerList = () => {
    const layersSub = useReactiveVar(layers)
    
    return <div>

        <div className='row justify-content-center'>
            <div className='col-11'>
                {
                    Object.keys(layersSub).map((key: string) => {
                        switch (layersSub[key].layerType) {
                            case 'vector':
                                return <ShowVec key={key} layerKey={key}/>
                            case 'raster':
                                return <ShowRaster key={key} layerKey={key} />
                            default:
                                console.log('DEFAULT CASE from LayerList.tsx -> ', layersSub[key].layerType)
                                break;
                        }
                    })
                }
            </div>
        </div>

        
    </div>
}