import * as ReactDOM from "react-dom/client"
import * as React from 'react'
import { HttpLink, ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { App } from './App'
import { ErrorPage } from './ErrorPage'
import { Map } from "./map/Map"


const root = ReactDOM.createRoot(document.querySelector("#root"))


const createApolloClient = () => {
    const link = new HttpLink({
        uri: '/api/graphql'
    })

    return new ApolloClient({
        link,
        cache: new InMemoryCache()
    })
}


const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'map',
                element: <Map></Map>,
            },
            {
                path: 'home',
                element: <div>Hello world!</div>
            }
        ]
    },
]);

root.render(
    <ApolloProvider client={createApolloClient()}>
        <RouterProvider router={router} />
    </ApolloProvider>
)