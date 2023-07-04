import * as React from 'react'
import { Outlet } from 'react-router'

import { Toasts } from './Toasts'
import { NavBar } from './navbar/Navbar'
import { isLoading, toasts, classificationResponse } from '../main/map/rv'
import { socket } from './socket'
import { useLazyQuery, useReactiveVar } from '@apollo/client'
import { AVAILABLE_FILES } from '../main/map/restQueries'
import { ToastDataWithImgType } from '../main/map/types/interfacesTypeScript'
import * as bootstrap from 'bootstrap'
import { useTimelineStore } from '../timeline/store'

export const App = () => {

    const [isConnected, setIsConnected] = React.useState(socket.connected);
    const [fooEvents, setFooEvents] = React.useState([])
    const classificationResponseSub = useReactiveVar(classificationResponse)
    const TimelineStore = useTimelineStore()

    const dropdownElementList = document.querySelectorAll('.dropdown-toggle') as any
    const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl))

    const addImageToTimeline = useTimelineStore().addImageToTimeline

    const responseHandler = (response: string, event: string) => {
        let msg  = JSON.parse(response) as ToastDataWithImgType
            isLoading(false)
            toasts({[new Date().toLocaleString()]: {
                header: msg.header,
                message: msg.message,
                show: true,
                datetime: new Date(msg.datetime),
                color: 'text-bg-success'
            }})

            let operation = event.split('/')
            switch (operation[0]) {
                case 'unsupervised':
                    classificationResponse({
                        ...classificationResponseSub,
                        [event]: msg
                    })
                    break;
                case 'algorithm/timeline':
                    console.log('algorithm/timeline response -> ', response)
                    break
                default:
                    console.log("DEFAULT CASE FROM App.tsx -> ", operation[0])
                    break;
            }
            call1()
            call2()
            call3()
    }

    React.useEffect(() => {
        function onConnect() {
            setIsConnected(true);
        }
    
        function onDisconnect() {
            setIsConnected(false);
        }
    
        function onFooEvent(value: any) {
            setFooEvents(previous => [...previous, value]);
        }
    
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('foo', onFooEvent);
        socket.on("disconnect", (reason) => console.log('reasone -> ', reason))

        socket.on("unsupervised/kmean", (response) => responseHandler(response, "unsupervised/kmean"))
        socket.on("unsupervised/bisecting-kmean", (response) => responseHandler(response, "unsupervised/bisecting-kmean"))
        socket.on("unsupervised/gaussian-mixture", (response) => responseHandler(response, "unsupervised/gaussian-mixture"))
        socket.on("unsupervised/mean-shift", (response) => responseHandler(response, "unsupervised/mean-shift"))

        socket.on("download-sentinel", (response) => responseHandler(response, "download-sentinel"))
        socket.on("download-landsat", (response) => responseHandler(response, "download-landsat"))
        socket.on("clip-to-mask", (response) => responseHandler(response, "clip-to-mask"))
        socket.on("stack-bands", (response) => responseHandler(response, "stack-bands"))

        socket.on('automation/monitoring', (response) => responseHandler(response, 'automation/monitoring'))
        
        socket.on('automation/data-processing', (response) => responseHandler(response, 'automation/data-processing'))
        socket.on('automation/data-processing', (response) => responseHandler(response, 'automation/data-processing/progress'))


        socket.on("algorithm/timeline", (response) => addImageToTimeline(response))
        
        
    
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('foo', onFooEvent);
            // socket.off("unsupervised/kmean", )
        };
        }, [])

        const [call1] = useLazyQuery(AVAILABLE_FILES, {variables: {to: 'clip'}})
        const [call2] = useLazyQuery(AVAILABLE_FILES, {variables: {to: 'stack'}})
        const [call3] = useLazyQuery(AVAILABLE_FILES, {variables: {to: 'classification'}})
    
    

    return <div id="app" className='test-1' style={{height: '10%'}}>
        
        <NavBar />
        <div id='detail'>
            <Outlet />
        </div>

        <Toasts />
    </div>
}