import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { metadataImage, searchImages } from '../rv'


export const ImagesList = () => {
    const searchImagesSub = useReactiveVar(searchImages)
    
    return <div className='row justify-content-center overflow-auto'>
        <div className='col-12 ' style={{maxHeight: "600px"}}>
            <ul className='mt-1'>
                {
                    searchImagesSub.images.map((item: any, iter: number) => {
                        return <li key={iter} className="mb-1">
                            <div className="d-grid gap-2 col-10 mx-auto">
                                <button className="btn btn-sm btn-outline-primary" onClick={()=>metadataImage(item)}>{item.DATE_ACQUIRED} Cloud Cover ({item.CLOUD_COVER})</button>
                            </div>
                        </li>
                    })
                }
            </ul>
        </div>
    </div>
}