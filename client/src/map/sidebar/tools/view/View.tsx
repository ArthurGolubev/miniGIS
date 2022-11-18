import * as React from 'react'
import { AvailableFiles } from '../AvailableFiles'
import { ViewBtn } from './ViewBtn'


export const View = () => {

    return <div className='row justify-content-center'>
        <div className='col-11'>
            {/* <img src='classification/test.png' /> */}
        </div>
        <AvailableFiles />
        <ViewBtn />
    </div>
}