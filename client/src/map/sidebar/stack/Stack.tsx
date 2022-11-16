import * as React from 'react'
import { AvailableFiles } from '../AvailableFiles'
import { StackBtn } from './StackBtn'


export const Stack = () => {
    
    return <div className='row justify-content-center'>
        <div className='col-11'>
            <AvailableFiles />
            <StackBtn />
        </div>
    </div>
}