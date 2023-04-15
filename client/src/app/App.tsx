import * as React from 'react'
import { Outlet } from 'react-router'

import { Toasts } from './Toasts'
import { NavBar } from './navbar/Navbar'
// import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { ws as webSocket } from '../main/map/rv'


export const App = () => {
    // const ws = new WebSocket('ws://10.152.183.82:80/api/v2-rest/workflow/ws')
    const ws = new WebSocket('wss://minigis.in-arthurs-apps.space/api/v2-rest/workflow/ws')
    // const { sendJsonMessage, lastMessage, readyState } = useWebSocket("wss://minigis.in-arthurs-apps.space/api/v2-rest/ws")

    React.useEffect(() => {
        webSocket(ws)
    }, [])

    return <div id="app" className='test-1' style={{height: '10%'}}>
        
        <NavBar />
        <div id='detail'>
            <Outlet />
        </div>

        <Toasts />
    </div>
}