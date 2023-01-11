import * as React from "react"
import Toast from 'react-bootstrap/Toast'
import { ToastContainer } from 'react-bootstrap'
import { useReactiveVar } from "@apollo/client"
import { redirectTo, toasts } from "../main/map/rv"
import { Navigate, useNavigate } from "react-router"


export const Toasts = () => {
    const toastsSub = useReactiveVar(toasts)
    const navigate = useNavigate()
    const redirectToSub = useReactiveVar(redirectTo)

    if(redirectToSub != undefined){
        let path = redirectToSub.url
        redirectTo(undefined)
        return <Navigate to={path} />
        // return navigate(0)
    }

    return <ToastContainer position={"bottom-start"}>
        {Object.keys(toastsSub).map(key => {
            return <Toast 
                show={toastsSub[key].show}
                delay={5000}
                autohide
                onClose={() => toasts({...toastsSub, [key]: {...toastsSub[key], show: false}})}
                key={key}
                className={`${toastsSub[key].color} ms-2 mb-3`}
                >
                <Toast.Header>
                    <strong className="me-auto">{toastsSub[key].header}</strong>
                    <small>{toastsSub[key].datetime.toLocaleDateString()}</small>
                </Toast.Header>
                <Toast.Body>{toastsSub[key].message}</Toast.Body>
            </Toast>
        })}
    </ToastContainer>
}