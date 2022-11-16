import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { STACK_BANDS } from '../../query'
import { isLoading, selectedFiles } from '../../rv'


export const StackBtn = () => {
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [stack] = useLazyQuery(STACK_BANDS)

    const stackHandler = () => {
        isLoading(true)
        stack({
            variables: { files: selectedFilesSub.files.Stack },
            fetchPolicy: "network-only",
            onCompleted: () => isLoading(false)
        })
    }

    return <div className='row justify-content-center'>
        <div className='col-12'>
            <button onClick={() => stackHandler()} className='btn btn-sm btn-success' type='button'>Stack</button>
        </div>
    </div>

}