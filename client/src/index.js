import ReactDOM from "react-dom/client"
import React from 'react'
import { HttpLink, ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { App } from './App'
import { ErrorPage } from './ErrorPage'


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
        errorElement: <ErrorPage />
    }
]);

root.render(
        <RouterProvider router={router}>
            <ApolloProvider client={createApolloClient()}>
                <div>123</div>
            </ApolloProvider>
        </RouterProvider>
)