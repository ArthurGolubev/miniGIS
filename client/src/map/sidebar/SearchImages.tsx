import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { SEARCH_IMAGES } from '../query'
import { downloadImages, errors, imagePreview, mapObj, metadataImage, searchImages, sidebar } from '../rv'
import { ImagesList } from './ImagesList'
import { Metadata } from './Metadata'


export const SearchImages = () => {
    const errorsSub = useReactiveVar(errors)
    const sidebarSub = useReactiveVar(sidebar)
    const metadataImageSub = useReactiveVar(metadataImage)
    const searchImagesSub = useReactiveVar(searchImages)
    const mapObjSub = useReactiveVar(mapObj) as any
    const [searchImagesQuery, {data: data1, loading: loading1, error: error1}] = useLazyQuery(SEARCH_IMAGES, {fetchPolicy: "network-only"})
    

    const setPOI = () => {
        sidebar({...sidebarSub, setPOI: true})
        mapObjSub.pm.enableDraw('Marker', {
            tooltips: false,
            markerStyle: {
                title: "Установите POI"
            },
            continueDrawing: false,
        })
    }

    const searchImagesHandler = () => {
        if (searchImagesSub.period.start && searchImagesSub.period.end){
            searchImagesQuery({
                variables: {
                    poi: {lat: searchImagesSub.poi[1], lon: searchImagesSub.poi[0]},
                    date: {startDate: searchImagesSub.period.start, endDate: searchImagesSub.period.end},
                    sensor: searchImagesSub.sensor
                },
                onCompleted: data => searchImages({...searchImagesSub, images: data.searchImages})
            })
        } else {
            errors({...errorsSub, period: true})
        }
    }




    return <div>
        <div className='row justify-content-start'>
            <div className='col ms-2'>
                <button
                    onClick={()=>setPOI()}
                    className='btn btn-sm btn-success me-2'
                    type='button'
                    disabled={sidebarSub.setPOI}>
                        Указать точку на местности
                </button>
                <button
                    onClick={()=>searchImagesHandler()}
                    className='btn btn-sm btn-success'
                    type='button'
                    disabled={
                        searchImagesSub.poi.length <= 0 || loading1 || searchImagesSub.period.start == '' || searchImagesSub.period.end == ''
                        }>
                        Поиск
                </button>
            </div>
        </div>
        <div className='row justify-content-start'>
            <div className='col ms-2 mt-3'>
                <input type='date' id="start-date" 
                    onChange={e => searchImages({
                        ...searchImagesSub,
                        period: {
                            ...searchImagesSub.period,
                            start: e.target.value
                        }
                    })}
                /> - 
                <input type='date' id="end-date" 
                    onChange={e => searchImages({
                        ...searchImagesSub,
                        period: {
                            ...searchImagesSub.period,
                            end: e.target.value
                        }
                    })}
                />
            </div>
            {
                errorsSub.period &&
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
                    searchImagesSub.sensor == 'LC08' &&
                    <div className="alert alert-success text-center" role="alert">
                        Collection 1 (1982-2021)
                    </div>
                }
                <div className="input-group input-group-sm mb-3">
                    <label className="input-group-text" htmlFor="sensor">Спутник</label>
                    <select defaultValue="S2" className="form-select" id="sensor"
                        onChange={e => searchImages({...searchImagesSub, sensor: e.target.value})}>
                        <option value="S2">Sentinel 2</option>
                        <option value="LC08">Landsat 8</option>
                        {/* <option value={1}>Landsat 4</option>
                        <option value={2}>Landsat 5</option>
                        <option value={3}>Landsat 7</option>
                        <option value={4}>Sentinel 2</option> */}
                    </select>
                </div>
            </div>
        </div>
        <button onClick={()=>console.log(data1)} className='btn btn-sm btn-success' type='button' disabled={loading1}>data</button>
        <button onClick={()=>console.log(searchImagesSub)} className='btn btn-sm btn-success' type='button' disabled={loading1}>searchImagesSub</button>
        <button onClick={()=>console.log(error1)} className='btn btn-sm btn-success' type='button' disabled={loading1}>error</button>
        <button onClick={()=>console.log(downloadImages())} className='btn btn-sm btn-success' type='button' disabled={loading1}>downloadImages</button>
        
        {
            searchImagesSub.images.length > 0 && metadataImageSub == undefined &&
            <ImagesList />
        }
        {
            metadataImageSub &&
            <Metadata />
        }
    </div>
}