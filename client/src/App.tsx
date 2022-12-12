import * as React from 'react'
import { Outlet, Route, Router } from 'react-router'

import { Toasts } from './map/Toasts'


export const App = () => {
    
    return <div id="app" className='test-1' style={{height: '10%'}}>

        <div id='detail'>
            <Outlet />
        </div>

        <Toasts />
    </div>
}