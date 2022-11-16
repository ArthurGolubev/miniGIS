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
                onClick={()=>sidebar({...sidebarSub, show: 'Stack'})}
                className={sidebarSub.show == 'Stack' ? 'nav-link active' : 'nav-link'}
                type='button'>Stack</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>sidebar({...sidebarSub, show: 'Classification'})}
                className={sidebarSub.show == 'Classification' ? 'nav-link active' : 'nav-link'}
                type='button'>Классификация</button>
            </li>
        </ul>
    </div>
}