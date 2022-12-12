import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { showToggle } from '../../rv'
import { DetailPrev } from './control/detail/DetailPrev'
import { DetailResult } from './control/detail/DetailResult'
import { DetailVec } from './control/detail/DetailVec'
import { LayerList } from './control/LayerList'


export const Layers = () => {
    
    const showToggleSub = useReactiveVar(showToggle)


    if(showToggleSub.LayerList) return <LayerList />
    if(showToggleSub.DetailVec) return <DetailVec />
    if(showToggleSub.DetailPrev) return <DetailPrev />
    if(showToggleSub.DetailResult) return <DetailResult />


    return null

}