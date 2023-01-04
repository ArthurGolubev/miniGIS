import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { STACK_BANDS } from '../../../mutations'
import { AVAILABLE_FILES } from '../../../queries'
import { isLoading, selectedFiles, toasts } from '../../../rv'


export const StackBtn = () => {
    const isLoadingSub = useReactiveVar(isLoading)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [stack] = useMutation(STACK_BANDS, {fetchPolicy: 'network-only'})

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
            refetchQueries: [
                {query: AVAILABLE_FILES, variables: {to: 'Clip'}},
                {query: AVAILABLE_FILES, variables: {to: 'Stack'}},
                {query: AVAILABLE_FILES, variables: {to: 'Classification'}},
            ]
        })
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