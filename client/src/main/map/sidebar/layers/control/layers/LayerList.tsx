import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { useMap } from 'react-leaflet'
import { layers } from '../../../../rv'
import { ShowPrev } from '../show/ShowPrev'
import { ShowResult } from '../show/ShowResult'
import { ShowVec } from '../show/ShowVec'


export const LayerList = () => {
    const layersSub = useReactiveVar(layers)
    
    return <div>

        <div className='row justify-content-center'>
            <div className='col-11'>
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