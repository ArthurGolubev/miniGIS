import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { tools } from '../rv'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'


export const ToggleNavTabs = () => {
    const redirect = useNavigate()
    let location = useLocation()

    return <div className='mt-1'>
        <ul className='nav nav-tabs'>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/poi')}
                // onClick={()=>tools({...toolsSub, show: 'POI'})}
                className={location.pathname == 'main/poi' ? 'nav-link active' : 'nav-link'}
                type='button'>POI</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/clip')}
                className={location.pathname == 'main/clip' ? 'nav-link active' : 'nav-link'}
                type='button'>Clip</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/stack')}
                className={location.pathname == 'main/stack' ? 'nav-link active' : 'nav-link'}
                type='button'>Stack</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/classification')}
                className={location.pathname == 'main/classification' ? 'nav-link active' : 'nav-link'}
                type='button'>Classification</button>
            </li>
        </ul>
    </div>
}