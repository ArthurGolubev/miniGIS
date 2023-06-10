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
                type='button'>Найти</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/map/workflow/clip')}
                className={location.pathname == '/main/map/workflow/clip' ? 'nav-link active' : 'nav-link'}
                type='button'>Вырезать</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/map/workflow/stack')}
                className={location.pathname == '/main/map/workflow/stack' ? 'nav-link active' : 'nav-link'}
                type='button'>Объединить</button>
            </li>
            <li className='nav-item'>
                <button
                onClick={()=>redirect('/main/map/workflow/classification')}
                className={location.pathname == '/main/map/workflow/classification' ? 'nav-link active' : 'nav-link'}
                type='button'>Классифицировать</button>
            </li>
        </ul>
    </div>
}