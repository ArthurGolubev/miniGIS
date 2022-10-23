import * as React from 'react'
import { Outlet, Route, Router } from 'react-router'
import { NavBar } from './Navbar'


export const App = () => {
    
    return <div id="app" >
        <NavBar />
        
        <div id='detail'>
            <Outlet />
        </div>
    </div>
}