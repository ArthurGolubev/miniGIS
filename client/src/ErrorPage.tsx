import * as React from 'react'
import { useRouteError } from 'react-router'

export const ErrorPage = () => {
    const error = useRouteError() as any

    return <div id="error-page">
        <h1>Ooops!</h1>
        <p>Error</p>
        <p>
            <i>{error.statusText || error.message}</i>
        </p>
    </div>
}