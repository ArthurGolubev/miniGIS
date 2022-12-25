import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { imagesStack } from '../../main/map/rv'


export const StackIcon = () => {
    const imagesStackSub = useReactiveVar(imagesStack)

    let stack = 0
    if(imagesStackSub.hasOwnProperty("sentinel")) stack = stack + Object.keys(imagesStackSub.sentinel).length
    if(imagesStackSub.hasOwnProperty("landsat")) stack = stack + Object.keys(imagesStackSub.landsat).length

    
    return <button className='btn btn-sm btn-light position-relative'>
        <i className="icon bi-stack">
            <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger">
                { stack > 0 && stack }
            </span>
        </i>
    </button>
}