import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { metadataImage } from '../rv'


export const Metadata = () => {
    const metadataImageSub = useReactiveVar(metadataImage)

    return <div>
        <button onClick={()=>metadataImage(undefined)} className='btn btn-sm btn-success' type='button'>back to list</button>
        <p><b>Metadata</b></p>
        <ul className='overflow-auto' style={{maxHeight: "600px"}}>
            {
                Object.keys(metadataImageSub).map((key: string, iter: number) => {
                    return <li key={iter}>{key}: <b>{metadataImageSub[key]}</b></li>
                })
            }
        </ul>
    </div>
}