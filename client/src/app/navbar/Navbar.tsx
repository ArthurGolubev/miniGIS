import * as React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LoadingStatus } from './LoadingStatus'
import { StackIcon } from './StackIcon'
import { ProfileIcon } from './ProfileIcon'
import { ProgressBarStatus } from './ProgressBarStatus'
import { useTimelineStore } from '../../timeline/store'
import { useMainStore } from '../store'
import { useSidebarToggles } from '../../interface/stores/SidebarToggles'
import { useLoading } from '../../interface/stores/Loading'


export const NavBar = () => {

    const setToggle = useSidebarToggles(state => state.setToggle)
    const isLoadingSub2 = useMainStore().isLoading
    const isProgressBarSub = useTimelineStore().isProgressBar
    const setLoading = useMainStore().setLoading
    const location = useLocation()
    const isLoading = useLoading(state => state.isLoading)

    React.useEffect(() => {
        if(isProgressBarSub == undefined){setLoading(false)}
    }, [isProgressBarSub])
    

    
    return <nav className='navbar navbar-expand-sm bg-light' style={{height: '5vh'}}>
        <div className='container-fluid'>
            <Link className='navbar-brand' to={'/'}>
                miniGIS+
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
        
            <div className="collapse navbar-collapse " id="navbarNav">
                <div className='col-auto text-center'>
                    {(isLoading || isLoadingSub2) && <LoadingStatus />}
                </div>
                <div className='col-1 text-center'>
                    {isProgressBarSub != undefined && <ProgressBarStatus />}
                </div>
                <div className='ms-auto'>
                    <div className='row justify-content-center'>
                        <div className='col'>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <Link
                                    data-testid="link-automation/step-0"
                                    to='/main/automation/step-0'
                                    className={location.pathname.startsWith('/main/automation/step-') ? 'nav-link active' : 'nav-link'}
                                    type='button'>Автоматизация</Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                    to='/main/map/workflow/poi'
                                    className={location.pathname.startsWith('/main/map/workflow') ? 'nav-link active' : 'nav-link'}
                                    type='button'
                                    >Рабочий процесс</Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                    to='/main/map/layers'
                                    onClick={()=>{ setToggle({LayerList: true}) }}
                                    className={location.pathname.startsWith('/main/map/layers') ? 'nav-link active' : 'nav-link'}
                                    type='button'>Добавить слой</Link>
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