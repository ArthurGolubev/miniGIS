import * as React from "react"
import Toast from 'react-bootstrap/Toast'
import { ToastContainer } from 'react-bootstrap'
import { useReactiveVar } from "@apollo/client"
import { toasts } from "./rv"


export const Toasts = () => {
    const toastsSub = useReactiveVar(toasts)

    return <ToastContainer position={"bottom-start"}>
        {Object.keys(toastsSub).map(key => {
            return <Toast 
                show={toastsSub[key].show}
                delay={5000}
                autohide
                onClose={() => toasts({...toastsSub, [key]: {...toastsSub[key], show: false}})}
                key={key}
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