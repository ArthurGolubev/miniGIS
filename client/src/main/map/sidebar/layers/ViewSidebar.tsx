import * as React from 'react'
import { DetailVec } from './control/detail/DetailVec'
import { Layers } from './control/layers/Layers'
import { DetailRaster } from './control/detail/DetailRaster'
import { useSidebarToggles } from '../../../../interface/stores/SidebarToggles'


export const ViewSidebar = () => {
    const show = useSidebarToggles((state) => state.show)

    if(show.LayerList) return <Layers />
    if(show.DetailVec) return <DetailVec />
    if(show.DetailRaster) return <DetailRaster />



    return null

}