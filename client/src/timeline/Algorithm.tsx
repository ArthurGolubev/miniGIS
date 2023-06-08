import * as React from 'react'
import { Outlet, useLocation, useParams } from 'react-router'
import { useTimelineStore } from './store'
import { AlgorithmType, useProfileStore } from '../profile/store'
import { socket } from '../app/socket'
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ImageOverlay } from 'react-leaflet'
import { LatLngBounds, CRS } from 'leaflet'
import { StatisticTable1 } from './StatisticTable1'
import { ClassificationReport } from './ClassificationReport'
import { Link } from 'react-router-dom'
import { useMainStore } from '../app/store'

export const Algorithm = () => {
    const location = useLocation()
    const setLoading = useMainStore().setLoading
    console.log('local.path -> ', location.pathname)
    const slug = useParams()

    
    const timalineImages = useTimelineStore().timalineImages
    const algorithmDetail = useTimelineStore().algorithmDetail
    const fetchAlgDetailById = useTimelineStore().fetchAlgDetailById

    React.useEffect(()=>{
        fetchAlgDetailById(slug.slug)
        setLoading(true)
    }, [])


    

    return <div className='row justify-content-center'>
        <div className='col-12'>
                <div className='row justify-content-center'>
                    <div className='col-6'>
                        
                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <h4>{algorithmDetail.name}</h4>
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <p>{algorithmDetail.alg_name}</p>
                            </div>
                            <div className='col'>
                                <p>{algorithmDetail.alg_param}</p>
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-12'>
                                {/* <p>{.last_file_name}</p> */}
                            </div>
                        </div>

                    </div>
                </div>


                
                {
                    timalineImages.length > 0 && 
                    timalineImages.map((img, iter) => {
                        console.log('img -> ', img)
                        let bounds = img.statistic.bounds.map((coord: any) => [coord[1], coord[0]])
                        console.log('some bounds -> ', bounds)
                        console.log('some bounds 2 -> ', img.preview.bounds)

                        {/* -------------------------------------------MAP-Start------------------------------------------ */}
                        return <div key={iter} className='row justify-content-center mb-5'>
                            <div className='col-6'>
                                <div className='card'>
                                    <div className='card-body'>
                                        <h5 className='card-title'>{img.date.toLocaleDateString()}</h5>
                                        <MapContainer
                                        center={bounds[0]}
                                        zoom={13}
                                        scrollWheelZoom={false}
                                        style={{ height: '55vh', width: '100wh' }}
                                        attributionControl={false}
                                        >
                                            <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <LayersControl position="topright">
                                                <LayersControl.Overlay
                                                    name={img.date.toDateString()}
                                                    checked={true}>
                                                    <ImageOverlay
                                                        url={img.preview.img_url}
                                                        bounds={img.preview.bounds.map((point: Array<number>) => [point[1], point[0]])}
                                                        zIndex={10}
                                                    />
                                                </LayersControl.Overlay>
                                                <LayersControl.Overlay
                                                    name={`${algorithmDetail.alg_name}-${algorithmDetail.alg_param}`}
                                                    checked={true}>
                                                    <ImageOverlay
                                                        url={URL.createObjectURL(img.img)}
                                                        bounds={bounds}
                                                        zIndex={10}
                                                        />
                                                </LayersControl.Overlay>
                                            </LayersControl>
                                        </MapContainer>
                                    </div>
                                </div>
                            </div>
                        {/* -------------------------------------------MAP-End-------------------------------------------- */}

                        {/* -------------------------------------------classification-statisitc-Start------------------------------------------ */}
                            <div className='col-5'>

                                <div className='row justify-content-center'>
                                    <div className='col-auto'>
                                        <ul className='nav nav-pills nav-fill'>
                                            <li className='nav-item'>
                                                <Link
                                                className={location.pathname == `/algorithm/${slug.slug}/tab1` ? 'nav-link active' : 'nav-link'}
                                                to={`/algorithm/${slug.slug}/tab1`}>tab1</Link>
                                            </li>
                                            <li className='nav-item'>
                                                <Link
                                                className={location.pathname == `/algorithm/${slug.slug}/tab2` ? 'nav-link active' : 'nav-link'}
                                                to={`/algorithm/${slug.slug}/tab2`}>tab2</Link>
                                            </li>
                                            <li className='nav-item'>
                                                <Link
                                                className={location.pathname == `/algorithm/${slug.slug}/tab3` ? 'nav-link active' : 'nav-link'}
                                                to={`/algorithm/${slug.slug}/tab3`}>tab3</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className='row justify-content-center'>
                                    <div className='col-12'>
                                        <Outlet context={[img]} />
                                    </div>
                                </div>

                            </div>
                            {/* -------------------------------------------classification-statisitc-End-------------------------------------------- */}

                        </div>
                })
                }


        </div>
    </div>
}