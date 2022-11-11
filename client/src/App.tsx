import * as React from 'react'
import { Outlet, Route, Router } from 'react-router'
import { NavBar } from './Navbar'

import { Toasts } from './map/Toasts'


export const App = () => {
    
    return <div id="app" >
        <NavBar />
        
        <div id='detail'>
            <Outlet />
        </div>

        <Toasts />
    </div>
}