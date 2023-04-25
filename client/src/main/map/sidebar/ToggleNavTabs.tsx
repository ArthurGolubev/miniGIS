import * as React from 'react'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'


export const ToggleNavTabs = () => {
    const redirect = useNavigate()
    let location = useLocation()

    return <div className='mt-1'>
        <ul className='nav nav-tabs'>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/map/workflow/poi')}
                className={location.pathname == '/main/map/workflow/poi' ? 'nav-link active' : 'nav-link'}
                type='button'>POI</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/map/workflow/clip')}
                className={location.pathname == '/main/map/workflow/clip' ? 'nav-link active' : 'nav-link'}
                type='button'>Clip</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/map/workflow/stack')}
                className={location.pathname == '/main/map/workflow/stack' ? 'nav-link active' : 'nav-link'}
                type='button'>Stack</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/map/workflow/classification')}
                className={location.pathname == '/main/map/workflow/classification' ? 'nav-link active' : 'nav-link'}
                type='button'>Classification</button>
            </li>
        </ul>
    </div>
}