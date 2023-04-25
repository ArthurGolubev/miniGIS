import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { Outlet } from 'react-router'


export const Sidebar = () => {

    console.log("location ->", location)
    return <div className='card overflow-hidden' style={{height: "100%"}}>
        <Outlet />
    </div>
}