import * as React from 'react'
import { Link } from 'react-router-dom'


export const NavBar = () => {

    return <nav className='navbar navbar-expand-sm bg-light'>
        <div className='container-fluid'>
            <Link className='navbar-brand' to={'/'}>
                    {/* <img src="{{ url_for('static', path='icons8-globe-32.png') }}" alt="NOTHING!" width="30" height="24" /> */}
                miniGIS
            </Link>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/map">Map</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
                </li>
            </ul>
        </div>
    </nav>
}