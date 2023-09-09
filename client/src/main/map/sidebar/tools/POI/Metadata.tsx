import * as React from 'react'
import { DownloadBtn } from './DownloadBtn'
import { BandsList } from './BandsList'
import { useLocation } from 'react-router'
import { useSelectedImage } from '../../../../../analysis/stores/selectedImage'


export const Metadata = () => {
    const location = useLocation()
    const setSelectedImage = useSelectedImage(state => state.setSelectedImage)


    return <div className='row justify-content-start'>
        <div className='col-11 ms-2'>
            <div className='row justify-content-start'>
                <div className='col-auto'>
                    <button 
                    onClick={()=>setSelectedImage({metadata: undefined, imgUrl: '', sensor: '', systemIndex: ''})}
                    className='btn btn-sm btn-light' type='button'>
                        <i className="bi bi-arrow-left link-primary"></i> назад
                    </button>
                </div>
                {
                    location.pathname == '/main/map/workflow/poi' && (
                        <div className='col-auto'>
                            <DownloadBtn />
                        </div>
                    )
                }
            </div>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <BandsList />
                </div>
            </div>

        </div>
    </div>
}