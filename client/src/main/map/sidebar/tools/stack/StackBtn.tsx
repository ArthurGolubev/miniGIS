import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { AVAILABLE_FILES } from '../../../restQueries'
import { isLoading, selectedFiles, toasts, websocketMessages, ws } from '../../../rv'
import { useLocation } from 'react-router'


export const StackBtn = () => {
    const isLoadingSub = useReactiveVar(isLoading)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const wsSub = useReactiveVar(ws) as any
    const websocketMessagesSub = useReactiveVar(websocketMessages)
    const location = useLocation()

    React.useEffect(() => {
        if(!wsSub) return
        wsSub.onmessage = (e: any) => {
            const message = JSON.parse(e.data)
            websocketMessages([...websocketMessagesSub, message])
            if(message.operation == 'stack-bands'){
                isLoading(false)
                toasts({[new Date().toLocaleString()]: {
                    header: message.header,
                    message: message.message,
                    show: true,
                    datetime: new Date(message.datetime),
                    color: 'text-bg-success'
                }})
                call1()
                call2()
                call3()
            }
        }
    })
    const stackHandler = () => {
        isLoading(true)
        console.log('selectedFilesSub.files[location.pathname] -> ', selectedFilesSub.files[location.pathname])
        wsSub.send(JSON.stringify( {
            operation: 'stack-bands',
            token: `Bearer ${localStorage.getItem("miniGISToken")}`,
            files: selectedFilesSub.files[location.pathname]
        }))
    }

    const [call1] =useLazyQuery(AVAILABLE_FILES, {variables: {to: 'clip'}})
    const [call2] =useLazyQuery(AVAILABLE_FILES, {variables: {to: 'stack'}})
    const [call3] =useLazyQuery(AVAILABLE_FILES, {variables: {to: 'classification'}})


    return <div className='row justify-content-center'>
        <div className='col-12'>
            <button
            onClick={() => stackHandler()}
            disabled={isLoadingSub}
            className='btn btn-sm btn-success' type='button'>Stack</button>
        </div>
    </div>

}