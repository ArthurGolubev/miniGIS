import * as React from 'react'
import { Outlet, Route, Router } from 'react-router'
import { NavBar } from './navbar/Navbar'

import { Toasts } from './map/Toasts'
import { Map } from './map/Map'


export const App = () => {
    
    return <div id="app" >
        <NavBar />

        <div id='detail'>
            <Outlet />
        </div>

        <Toasts />
    </div>
}