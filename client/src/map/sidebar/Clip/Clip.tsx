import * as React from 'react'
import { AvailableFiles } from './AvailableFiles'
import { GeometryTable } from './GeometryTable'


export const Clip = () => {


    return <div className='row justify-content-center'>
        <AvailableFiles />
        <GeometryTable />
    </div>
}