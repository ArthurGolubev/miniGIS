import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { STACK_BANDS } from '../../../query'
import { isLoading, selectedFiles, toasts } from '../../../rv'


export const StackBtn = () => {
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [stack] = useLazyQuery(STACK_BANDS)

    const stackHandler = () => {
        isLoading(true)
        stack({
            variables: { files: selectedFilesSub.files.Stack },
            fetchPolicy: "network-only",
            onCompleted: data => {
                toasts({[new Date().toLocaleString()]: {
                    header: data.stackBands.header,
                    message: data.stackBands.message,
                    show: true,
                    datetime: new Date(data.stackBands.datetime),
                    color: 'text-bg-success'
                }})
                isLoading(false)
            },
        })
    }

    return <div className='row justify-content-center'>
        <div className='col-12'>
            <button onClick={() => stackHandler()} className='btn btn-sm btn-success' type='button'>Stack</button>
        </div>
    </div>

}