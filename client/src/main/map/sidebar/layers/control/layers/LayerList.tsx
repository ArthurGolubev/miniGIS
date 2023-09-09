import * as React from 'react'
import { ShowRaster } from '../show/ShowRaster'
import { ShowVec } from '../show/ShowVector'
import { useLayer } from '../../../../../../analysis/stores/layer'


export const LayerList = () => {
    const layers = useLayer(state => state.layers)
    
    return <div>

        <div className='row justify-content-center'>
            <div className='col-11'>
                {
                    Object.keys(layers).map((key: string) => {
                        switch (layers[key].layerType) {
                            case 'vector':
                                return <ShowVec key={key} layerKey={key}/>
                            case 'raster':
                                return <ShowRaster key={key} layerKey={key} />
                            default:
                                console.log('DEFAULT CASE from LayerList.tsx -> ', layers[key].layerType)
                                break;
                        }
                    })
                }
            </div>
        </div>

        
    </div>
}