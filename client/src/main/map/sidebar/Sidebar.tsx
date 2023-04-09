import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { sidebar } from '../rv'
import { ViewSidebar } from './layers/ViewSidebar'
import { ShowSelectedTab } from './tools/ShowSelectedTab'


export const Sidebar = () => {
    const sidebarSub = useReactiveVar(sidebar)

    console.log("location ->", location)
    return <div className='card overflow-hidden' style={{height: "100%"}}>
        { sidebarSub.show == 'tools' && <ShowSelectedTab />   }
        { sidebarSub.show == 'layers' && <ViewSidebar /> }
    </div>
}