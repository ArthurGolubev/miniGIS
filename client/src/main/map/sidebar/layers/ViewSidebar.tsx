import * as React from 'react'
import { showToggle } from '../../rv'
import { useReactiveVar } from '@apollo/client'
import { DetailVec } from './control/detail/DetailVec'
import { Layers } from './control/layers/Layers'
import { DetailRaster } from './control/detail/DetailRaster'


export const ViewSidebar = () => {
    
    const showToggleSub = useReactiveVar(showToggle)

    if(showToggleSub.LayerList) return <Layers />
    if(showToggleSub.DetailVec) return <DetailVec />
    if(showToggleSub.DetailRaster) return <DetailRaster />


    return null

}