import * as React from 'react'
import { AvailableFiles } from '../AvailableFiles'
import { ViewBtn } from './ViewBtn'


export const View = () => {

    return <div className='row justify-content-center'>
        <AvailableFiles />
        <ViewBtn />
    </div>
}