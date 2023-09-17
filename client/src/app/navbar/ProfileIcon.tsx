import * as React from "react"
import 'bootstrap'
import { Link, useNavigate } from "react-router-dom"
import { useProfileStore } from "../../profile/store"



export const ProfileIcon = () => {
    const redirect = useNavigate()
    const username = useProfileStore().username
    const logout = () => {
        localStorage.removeItem("miniGISToken")
        localStorage.removeItem("usr")
        redirect('/authorization')
    }

    return <div className="dropstart">
        <button onClick={()=>console.log('123')} className='btn btn-sm btn-light dropdown-toggle' type='button' data-bs-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-person-square"></i>
        </button>
        <ul className="dropdown-menu">
            <li className="mb-1">
                <h6 className="dropdown-header text-center">{localStorage.getItem("usr")}</h6>
            </li>
            <li>
                <Link to={'/profile'} className='dropdown-item'>Профиль</Link>
            </li>
            <li>
                <Link to={'/authorization'} className='dropdown-item'>Авторизация</Link>
            </li>
            <li>
                <Link to={'/registration'} className='dropdown-item'>Регистрация</Link>
            </li>
            <li className="dropdown-item text-center">
                <button onClick={()=>logout()} className='btn btn-sm btn-success' type='button'>Выйти</button>
            </li>
        </ul>
    </div>
}