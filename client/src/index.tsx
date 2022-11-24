import * as ReactDOM from "react-dom/client"
import * as React from 'react'
import { HttpLink, ApolloClient, ApolloProvider, InMemoryCache, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { App } from './App'
import { ErrorPage } from './ErrorPage'
import { Map } from "./map/Map"
import { isLoading, toasts } from "./map/rv"


const root = ReactDOM.createRoot(document.querySelector("#root"))


const createApolloClient = () => {
    const httpLink = new HttpLink({
        uri: '/api/graphql'
    })

    const errorLink = onError(({graphQLErrors, networkError}) => {
        if(graphQLErrors){
            graphQLErrors.forEach(({message, path}) => {
                toasts({
                [new Date().toLocaleString()]: {
                    header: 'Ошибка GraphQL',
                    message: `Message: ${message}, Path: ${path}`,
                    datetime: new Date(),
                    show: true,
                    color: 'text-bg-danger'
                }
            })
            console.log(message)
        })
            isLoading(false)
        }
        if(networkError){
            toasts({
                [new Date().toLocaleString()]: {
                    header: 'Сетевая ошибка',
                    message: `Message: ${networkError}`,
                    datetime: new Date(),
                    show: true,
                    color: 'text-bg-danger'
                }
            })
            console.log(networkError)
            isLoading(false)
        }
    })

    return new ApolloClient({
        link: from([errorLink,httpLink]),
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
                element: <Map />,
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