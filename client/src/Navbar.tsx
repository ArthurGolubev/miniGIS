import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { imagesStack, isLoading } from './map/rv'


export const NavBar = () => {
    const isLoadingSub = useReactiveVar(isLoading)
    const imagesStackSub = useReactiveVar(imagesStack)
    
    let stack = 0
    if(imagesStackSub.hasOwnProperty("sentinel")) stack = stack + Object.keys(imagesStackSub.sentinel).length
    if(imagesStackSub.hasOwnProperty("landsat")) stack = stack + Object.keys(imagesStackSub.landsat).length

    return <nav className='navbar navbar-expand-sm bg-light'>
        <div className='container-fluid'>
            <Link className='navbar-brand' to={'/'}>
                    {/* <img src="{{ url_for('static', path='icons8-globe-32.png') }}" alt="NOTHING!" width="30" height="24" /> */}
                miniGIS
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        
            <div className="collapse navbar-collapse " id="navbarNav">
                <div className='col-auto'>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/map">Map</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
                        </li>
                    </ul>
                </div>
                <div className='col-auto text-center'>
                    {isLoadingSub && <div className="spinner-grow spinner-grow-sm text-success"><span className="visually-hidden">Loading...</span></div>}
                </div>
                <div className='ms-auto'>
                    <button className='btn btn-sm btn-light position-relative'>
                        <i className="icon bi-stack">
                            <span className="position-absolute top-50 start-100 translate-middle badge rounded-pill bg-danger">
                                { stack > 0 && stack }
                            </span>
                        </i>
                    </button>
                </div>
            </div>
        </div>
    </nav>
}