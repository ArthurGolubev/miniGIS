import * as React from 'react'
import { Map } from './map/Map'
import { Sidebar } from './map/sidebar/Sidebar'



export const Main = () => {

    return <div className='row justify-content-center g-0'>
        <div className='col-9'>
            <Map />
        </div>
        <div className='col-3'>
            <Sidebar />
        </div>
    </div>
}