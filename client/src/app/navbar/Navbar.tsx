import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { isLoading, isProgress, showToggle } from '../../main/map/rv'
import { LoadingStatus } from './LoadingStatus'
import { StackIcon } from './StackIcon'
import { ProfileIcon } from './ProfileIcon'
import { ProgressBarStatus } from './ProgressBarStatus'
import { useTimelineStore } from '../../timeline/store'


export const NavBar = () => {
    const isLoadingSub = useReactiveVar(isLoading)
    const isProgressBarSub = useTimelineStore().isProgressBar
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
                <div className='col-1 text-center'>
                    {isProgressBarSub != undefined && <ProgressBarStatus />}
                </div>
                <div className='ms-auto'>
                    <div className='row justify-content-center'>
                        <div className='col'>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a href='#/main/automation/step-0' className='nav-link active' type='button'>Automation</a>
                                </li>
                                <li className="nav-item">
                                    <a href='#/main/map/workflow/poi' className='nav-link active' type='button'>Tools</a>
                                </li>
                                <li className="nav-item">
                                    <a href='#/main/map/layers' onClick={()=>{
                                        showToggle({...showToggleSub, LayerList: true})
                                        }} className='nav-link active' type='button'>Layers</a>
                                </li>
                            </ul>
                        </div>

                        <div className='col-auto'>
                            <ProfileIcon />
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