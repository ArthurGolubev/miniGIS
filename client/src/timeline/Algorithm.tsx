import * as React from 'react'
import { useLocation, useParams } from 'react-router'
import { useTimelineStore } from './store'
import { AlgorithmType, useProfileStore } from '../profile/store'
import { socket } from '../app/socket'
import { MapContainer, TileLayer, Marker, Popup, LayersControl, ImageOverlay } from 'react-leaflet'
import { LatLngBounds, CRS } from 'leaflet'

export const Algorithm = () => {

    const slug = useParams()

    const userAlg = useProfileStore().userAlg
    const timalineImages = useTimelineStore().timalineImages

    React.useEffect(()=>{
        let path = userAlg[slug.slug].mask.split('/').slice(0, -2)
        socket.emit("algorithm/timeline", {path: path.join('/')})
    }, [])


    

    return <div className='row justify-content-center'>
        <div className='col-12'>
                <div className='row justify-content-center'>
                    <div className='col-6'>
                        
                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <h1>{userAlg[slug.slug].name}</h1>
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <p>{userAlg[slug.slug].alg_name}</p>
                            </div>
                            <div className='col'>
                                <p>{userAlg[slug.slug].alg_param}</p>
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-12'>
                                <p>{userAlg[slug.slug].last_file_name}</p>
                            </div>
                        </div>

                    </div>
                </div>

                <button onClick={()=>console.log(timalineImages)} className='btn btn-sm btn-success' type='button'>img</button>

                {
                    timalineImages.length > 0 && 
                    timalineImages.map((img, iter) => {
                        console.log('img -> ', img)
                        let bounds = img.statistic.bounds.map((coord: any) => [coord[1], coord[0]])
                        console.log('some bounds -> ', bounds)
                        return <div key={iter} className='row justify-content-center mb-4'>
                            <div className='col-5'>
                                <div className='card'>
                                    <img className='card-img-top' src={URL.createObjectURL(img.img)} />
                                    <div className='card-body'>
                                        <h5 className='card-title'>{img.date.toLocaleDateString()}</h5>
                                        {/* отобразить классификацию на привью, которое на карте */}
                                        {/* слой с классификацией должен иметь возможность скрываться, или менять прозрачность */}
                                        <MapContainer crs={CRS.EPSG4326} center={bounds[0]} zoom={13} scrollWheelZoom={false} style={{ height: '100vh', width: '100wh' }}>
                                            <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <LayersControl position="topright">
                                                <LayersControl.Overlay name="Marker with popup">
                                                    <ImageOverlay
                                                        url={URL.createObjectURL(img.img)}
                                                        bounds={bounds}
                                                        // opacity={0.5}
                                                        zIndex={10}
                                                        />
                                                </LayersControl.Overlay>
                                            </LayersControl>
                                        </MapContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                })
                }


        </div>
    </div>
}