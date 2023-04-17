import * as React from 'react'
import { useLocation } from 'react-router'
import { useReactiveVar } from '@apollo/client'
import { socket } from '../../../../../app/socket'
import { isLoading, selectedFiles, toasts } from '../../../rv'


export const StackBtn = () => {
    const isLoadingSub = useReactiveVar(isLoading)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const location = useLocation()

    const stackHandler = () => {
        isLoading(true)
        socket.emit(
            "stack-bands",
            {
                files: selectedFilesSub.files[location.pathname]
            },
        )
    }


    return <div className='row justify-content-center'>
        <div className='col-12'>
            <button
            onClick={() => stackHandler()}
            disabled={isLoadingSub}
            className='btn btn-sm btn-success' type='button'>Stack</button>
        </div>
    </div>

}