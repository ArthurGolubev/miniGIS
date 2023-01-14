import * as React from 'react'
import { Outlet, Route, Router } from 'react-router'

import { Toasts } from './Toasts'
import { NavBar } from './navbar/Navbar'


export const App = () => {

    return <div id="app" className='test-1' style={{height: '10%'}}>
        <NavBar />
        <div id='detail'>
            <Outlet />
        </div>

        <Toasts />
    </div>
}