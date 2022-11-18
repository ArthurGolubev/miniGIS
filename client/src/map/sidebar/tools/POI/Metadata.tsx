import * as React from 'react'
import { useReactiveVar } from '@apollo/client'
import { selectedImage, preview } from '../../../rv'
import { DownloadBtn } from './DownloadBtn'
import { BandsList } from './BandsList'


export const Metadata = () => {
    const selectedImageSub  = useReactiveVar(selectedImage)
    const previewSub        = useReactiveVar(preview) as any


    return <div className='row justify-content-start'>
        <div className='col-11 ms-2'>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <button onClick={()=>selectedImage(undefined)} className='btn btn-sm btn-success' type='button'>back to list</button>
                    <DownloadBtn />
                    <BandsList />
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th className="text-center" scope='col' colSpan={2}>Основные методанные</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope='row'>UTM_ZONE</th>
                                <td>{selectedImageSub.UTM_ZONE}</td>
                            </tr>
                            <tr>
                                <th scope='row'>DATE_ACQUIRED</th>
                                <td>{selectedImageSub.DATE_ACQUIRED}</td>
                            </tr>
                            <tr>
                                <th scope='row'>CLOUD_COVER</th>
                                <td>{selectedImageSub.CLOUD_COVER}</td>
                            </tr>
                            <tr>
                                <th scope='row'>CLOUD_COVER_LAND</th>
                                <td>{selectedImageSub.CLOUD_COVER_LAND}</td>
                            </tr>
                            <tr>
                                <th scope='row'>PROCESSING_LEVEL</th>
                                <td>{selectedImageSub.DATA_ACQUIRED}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <label htmlFor="previewOpacity" className="form-label">Прозрачность</label>
                    <input type="range" className="form-range" min="" max="100" defaultValue={100} id="previewOpacity"
                        onChange={e => previewSub.setOpacity(parseInt(e.target.value) / 100) }
                    />
                </div>
            </div>
            <div className='row justify-content-center h-25'>
                <div className='col-12 overflow-auto'>
                    <p className='mt-2 text-center'><b>Все методанные</b></p>
                    {/* <ul>
                        {
                            Object.keys(metadataImageSub).map((key: string, iter: number) => {
                                if(key !== 'system:footprint'){
                                    return <li key={iter}>{key}: <b>{metadataImageSub[key]}</b></li>
                                } else return null
                            })
                        }
                    </ul> */}
                </div>
            </div>

        </div>
    </div>
}