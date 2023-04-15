import * as React from 'react'
import { useReactiveVar } from '@apollo/client'
import { selectedImage } from '../../../rv'
import { DownloadBtn } from './DownloadBtn'
import { BandsList } from './BandsList'


export const Metadata = () => {
    const selectedImageSub  = useReactiveVar(selectedImage)


    return <div className='row justify-content-start'>
        <div className='col-11 ms-2'>
            <div className='row justify-content-start'>
                <div className='col-auto'>
                    <button 
                    onClick={()=>selectedImage({metadata: undefined, imgUrl: '', sensor: '', systemIndex: ''})}
                    className='btn btn-sm btn-light' type='button'>
                        <i className="bi bi-arrow-left link-primary"></i> back
                    </button>
                </div>
                <div className='col-auto'>
                    <DownloadBtn />
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    <BandsList />
                </div>
            </div>

        </div>
    </div>
}