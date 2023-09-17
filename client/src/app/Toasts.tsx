import * as React from "react"
import Toast from 'react-bootstrap/Toast'
import { ToastContainer } from 'react-bootstrap'
import { Navigate } from "react-router"
import { useToasts } from "../interface/stores/Toasts"
import { useRedirectTo } from "../interface/stores/RedirectTo"


export const Toasts = () => {

    const setRedirectTo = useRedirectTo(state => state.setRedirectTo)
    const toasts = useToasts(state => state.toasts)
    const setToast = useToasts(state => state.setToast)
    const redirectToPath = useRedirectTo(state => state.path)

    if(redirectToPath != undefined){
        let path = redirectToPath
        setRedirectTo(undefined)
        return <Navigate to={path} />
        // return navigate(0)
    }

    return <ToastContainer position={"bottom-start"}>
        {/* {Object.keys(toasts).map(key => {
            return <Toast 
                show={toasts[key].show}
                delay={50000}
                autohide
                onClose={() => setToast({[key]: {...toasts[key], show: false}}) }
                key={key}
                className={`${toasts[key].color} ms-2 mb-3`}
                >
                <Toast.Header>
                    <strong className="me-auto">{toasts[key].header}</strong>
                    <small>{toasts[key].datetime.toLocaleDateString()}</small>
                </Toast.Header>
                <Toast.Body>{toasts[key].message}</Toast.Body>
            </Toast>
        })} */}
    </ToastContainer>
}