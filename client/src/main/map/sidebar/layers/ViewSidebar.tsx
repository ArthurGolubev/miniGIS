import * as React from 'react'
import { showToggle } from '../../rv'
import { useReactiveVar } from '@apollo/client'
import { DetailPrev } from './control/detail/DetailPrev'
import { DetailResult } from './control/detail/DetailResult'
import { DetailVec } from './control/detail/DetailVec'
import { Layers } from './control/layers/Layers'


export const ViewSidebar = () => {
    
    const showToggleSub = useReactiveVar(showToggle)

    if(showToggleSub.LayerList) return <Layers />
    if(showToggleSub.DetailVec) return <DetailVec />
    if(showToggleSub.DetailPrev) return <DetailPrev />
    if(showToggleSub.DetailResult) return <DetailResult />


    return null

}