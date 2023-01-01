import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { tools } from '../rv'


export const NavTabs = () => {
    const toolsSub = useReactiveVar(tools)

    return <div className='mt-1'>
        <ul className='nav nav-tabs'>
            <li className='nav-item'>
                <button
                onClick={()=>tools({...toolsSub, show: 'POI'})}
                className={toolsSub.show == 'POI' ? 'nav-link active' : 'nav-link'}
                type='button'>POI</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>tools({...toolsSub, show: 'Clip'})}
                className={toolsSub.show == 'Clip' ? 'nav-link active' : 'nav-link'}
                type='button'>Clip</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>tools({...toolsSub, show: 'Stack'})}
                className={toolsSub.show == 'Stack' ? 'nav-link active' : 'nav-link'}
                type='button'>Stack</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>tools({...toolsSub, show: 'Classification'})}
                className={toolsSub.show == 'Classification' ? 'nav-link active' : 'nav-link'}
                type='button'>Classification</button>
            </li>
            {/* <li className='nav-item'>
                <button
                onClick={()=>tools({...toolsSub, show: 'Open'})}
                className={toolsSub.show == 'Open' ? 'nav-link active' : 'nav-link'}
                type='button'>Open</button>
            </li> */}
        </ul>
    </div>
}