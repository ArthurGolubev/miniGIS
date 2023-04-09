import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { isLoading, showToggle, sidebar } from '../../main/map/rv'
import { LoadingStatus } from './LoadingStatus'
import { StackIcon } from './StackIcon'


export const NavBar = () => {
    const isLoadingSub = useReactiveVar(isLoading)
    const showToggleSub = useReactiveVar(showToggle)
    
    return <nav className='navbar navbar-expand-sm bg-light' style={{height: '5vh'}}>
        <div className='container-fluid'>
            <Link className='navbar-brand' to={'/'}>
                miniGIS
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        
            <div className="collapse navbar-collapse " id="navbarNav">
                <div className='col-auto text-center'>
                    {isLoadingSub && <LoadingStatus />}
                </div>
                <div className='ms-auto'>
                    <div className='row justify-content-center'>
                        <div className='col'>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a href='#/authorization' onClick={()=>sidebar({show: 'tools'})} className='nav-link active' type='button'>Authorization</a>
                                </li>
                                <li className="nav-item">
                                    <a href='#/registration' onClick={()=>sidebar({show: 'tools'})} className='nav-link active' type='button'>Registration</a>
                                </li>
                                <li className="nav-item">
                                    <a href='#/main' onClick={()=>sidebar({show: 'tools'})} className='nav-link active' type='button'>Tools</a>
                                </li>
                                <li className="nav-item">
                                    <a href='#/main' onClick={()=>{
                                        sidebar({show: 'layers'})
                                        showToggle({...showToggleSub, LayerList: true})
                                        }} className='nav-link active' type='button'>Layers</a>
                                </li>
                            </ul>
                        </div>

                        <div className='col-auto'>
                            <StackIcon />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    </nav>
}