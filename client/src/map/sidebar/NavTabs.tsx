import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { sidebar } from '../rv'


export const NavTabs = () => {
    const sidebarSub = useReactiveVar(sidebar)

    return <div className='mt-1'>
        <ul className='nav nav-tabs'>
            <li className='nav-item'>
                <button
                onClick={()=>sidebar({...sidebarSub, show: 'POI'})}
                className={sidebarSub.show == 'POI' ? 'nav-link active' : 'nav-link'}
                type='button'>POI</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>sidebar({...sidebarSub, show: 'Clip'})}
                className={sidebarSub.show == 'Clip' ? 'nav-link active' : 'nav-link'}
                type='button'>Clip</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>sidebar({...sidebarSub, show: 'Crop'})}
                className={sidebarSub.show == 'Crop' ? 'nav-link active' : 'nav-link'}
                type='button'>Кадрировать</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>sidebar({...sidebarSub, show: 'Analysis'})}
                className={sidebarSub.show == 'Analysis' ? 'nav-link active' : 'nav-link'}
                type='button'>Анализ</button>
            </li>
        </ul>
    </div>
}