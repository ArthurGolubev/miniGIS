import * as React from 'react'
import { useLocation } from 'react-router'
import { socket } from '../../../../../app/socket'
import { useLoading } from '../../../../../interface/stores/Loading'
import { useSelectedFiles } from '../../../../../analysis/stores/selectedFiles'



export const StackBtn = () => {
    const isLoading = useLoading(state => state.isLoading)
    const setLoading = useLoading(state => state.setLoading)
    const files = useSelectedFiles(state => state.files)
    const location = useLocation()

    const stackHandler = () => {
        setLoading(true)
        socket.emit(
            "stack-bands",
            {
                files: files[location.pathname]
            },
        )
    }


    return <div className='row justify-content-center'>
        <div className='col-12'>
            <button
            onClick={() => stackHandler()}
            disabled={isLoading}
            className='btn btn-sm btn-success' type='button'>Объединить</button>
        </div>
    </div>

}