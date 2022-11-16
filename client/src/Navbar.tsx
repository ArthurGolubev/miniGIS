import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { isLoading } from './map/rv'
import { WorkbenchStack } from './WorkbenchStack'


export const NavBar = () => {
    const isLoadingSub = useReactiveVar(isLoading)
    
    
    return <nav className='navbar navbar-expand-sm bg-light'>
        <div className='container-fluid'>
            <Link className='navbar-brand' to={'/'}>
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
                    <WorkbenchStack />
                </div>
            </div>
        </div>
    </nav>
}