import * as React from 'react'
import { useImagesStack } from '../../analysis/stores/imagesStack'


export const StackIcon = () => {
    const sentinel = useImagesStack(state => state.sentinel)
    const landsat = useImagesStack(state => state.landsat)

    let stack = 0
    if(sentinel) stack = stack + Object.keys(sentinel).length
    if(landsat) stack = stack + Object.keys(landsat).length

    
    return <button className='btn btn-sm btn-light position-relative'>
        <i className="icon bi-stack">
            <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger">
                { stack > 0 && stack }
            </span>
        </i>
    </button>
}