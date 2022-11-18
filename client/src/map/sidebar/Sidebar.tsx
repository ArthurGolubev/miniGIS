import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { useLocation } from 'react-router'
import { sidebar, tools } from '../rv'
import { Layers } from './layers/Layers'
import { Tools } from './tools/Tools'


export const Sidebar = () => {
    const sidebarSub = useReactiveVar(sidebar)

    console.log("location ->", location)
    return <div className='card overflow-hidden' style={{height: "100%"}}>
        { sidebarSub.show == 'tools' && <Tools />   }
        { sidebarSub.show == 'layers' && <Layers /> }
    </div>
}