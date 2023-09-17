import * as React from 'react'
import { ax } from '../../../../../axiosInstance'
import { ImagesList } from './ImagesList'
import { Metadata } from './Metadata'
import { useToolsToggles } from '../../../../../analysis/stores/toolsToggles'
import { useSearchImages } from '../../../../../analysis/stores/searchImages'
import { useToasts } from '../../../../../interface/stores/Toasts'
import { useLoading } from '../../../../../interface/stores/Loading'
import { useErrors } from '../../../../../interface/stores/errors'
import { useSelectedImage } from '../../../../../analysis/stores/selectedImage'
import { useMapObject } from '../../../../../analysis/stores/MapObject'


export const SearchImages = () => {
    
    const setToast = useToasts(state => state.setToast)
    const showTools = useToolsToggles(state => state.showTools)
    const POI = useToolsToggles(state => state.POI)
    const setSearchImages = useSearchImages(state => state.setSearchImages)
    const endDate = useSearchImages(state => state.endDate)
    const startDate = useSearchImages(state => state.startDate)
    const poi = useSearchImages(state => state.poi)
    const sensor = useSearchImages(state => state.sensor)
    const images = useSearchImages(state => state.images)
    const setLoading = useLoading(state => state.setLoading)
    const periodError = useErrors(state => state.periodError)
    const setPeriodError = useErrors(state => state.setPeriodError)
    const metadata = useSelectedImage(state => state.metadata)
    const mapObject = useMapObject(state => state)


    

    const setPOI = () => {
        showTools({POI: true})
        mapObject.pm.enableDraw('Marker', {
            tooltips: false,
            markerStyle: {
                title: "Установите POI"
            },
            continueDrawing: false,
        })
    }

    interface SearchPreviewResponseType {
        images: Array<any>
        header: string
        message: string
        datetime: string
    }

    const searchImagesHandler = () => {
        if (startDate && endDate){
            setLoading(true)

            ax.post<SearchPreviewResponseType>('/workflow/search-preview', {
                input: {
                    poi: {lat: poi[1], lon: poi[0]},
                    date: {startDate, endDate},
                    sensor: sensor,
                    operation: 'search-preview'
                }
            }).then(response => {
                setSearchImages({images: response.data.images})
                    setToast({[new Date().toLocaleString()]: {
                        header: response.data.header,
                        message: response.data.message,
                        show: true,
                        datetime: new Date(response.data.datetime),
                        color: 'text-bg-success'
                    }})
                    setLoading(false)
            })
        } else {
            setPeriodError(true)
        }
    }




    return <div>
        <div className='row justify-content-start'>
            <div className='col ms-2'>
                <button
                    onClick={()=>setPOI()}
                    className='btn btn-sm btn-success me-2'
                    type='button'
                    disabled={POI}>
                        Указать точку на местности
                </button>
                <button
                    onClick={()=>searchImagesHandler()}
                    className='btn btn-sm btn-success'
                    type='button'
                    disabled={
                        poi.length <= 0 || startDate == undefined || endDate == undefined
                        }>
                        Поиск
                </button>
            </div>
        </div>
        <div className='row justify-content-start'>
            <div className='col ms-2 mt-3'>
                <input type='date' id="start-date" 
                    onChange={e => setSearchImages({startDate: e.target.value}) }
                /> - 
                <input type='date' id="end-date" 
                    onChange={e => setSearchImages({endDate: e.target.value}) }
                />
            </div>
            {
                periodError &&
                <div className='row justify-content-start'>
                    <div className='col-9 ms-2 mt-1'>
                        <div className="alert alert-danger" role="alert">
                            Укажите период времени
                        </div>
                    </div>
                </div>
            }
        </div>
        <div className='row justify-content-start'>
            <div className='col-9 ms-2 mt-3'>
                {
                    sensor == 'LC08' &&
                    <div className="alert alert-success text-center" role="alert">
                        Collection 1 (1982-2021)
                    </div>
                }
                <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text" htmlFor="sensor">Спутник</label>
                    <select defaultValue="S2" className="form-select" id="sensor"
                        onChange={e => setSearchImages({sensor: e.target.value})}>
                        <option value="S2">Sentinel 2</option>
                        <option value="LC08">Landsat 8</option>
                        <option value="LC07">Landsat 7</option>
                        <option value="LC05">Landsat 5</option>
                        <option value="LC04">Landsat 4</option>
                    </select>
                </div>
            </div>
        </div>
        {
            images.length > 0 && metadata == undefined &&
            <ImagesList />
        }
        {
            metadata &&
            <Metadata />
        }
    </div>
}