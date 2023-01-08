import * as ReactDOM from "react-dom/client"
import * as React from 'react'
import { HttpLink, ApolloClient, ApolloProvider, InMemoryCache, from } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { App } from './app/App'
import { ErrorPage } from './ErrorPage'
import { isLoading, toasts } from "./main/map/rv"
import { Main } from "./main/Main"
import { Registration } from "./profile/Registration"
import { RestLink } from "apollo-link-rest"
import camelCase from 'camelcase'
import { snakeCase  as snake_case } from 'snake-case'

const root = ReactDOM.createRoot(document.querySelector("#root"))


const createApolloClient = () => {
    const httpLink = new HttpLink({
        uri: '/api/graphql',
    })
    const restLink = new RestLink({
        uri: "/api/v2-rest",
        typePatcher: {
            AvailableFilesType: (data, outerType, patchDeeper) => {
                if (data != null) {
                    data.items = Object.keys(data).map(field => ({ __typename: "AvailableFile", [field]: data[field] }))
                }
                return data
            },
            TreeAvailableFiles: (data, outerType, patchDeeper) => {
                if (data != null) {
                    data.items = Object.keys(data).map(field => ({ __typename: "treeAvailableFiles", [field]: data[field] }))
                }
                return data
            }
        },
        // fieldNameNormalizer: (key: string) => camelCase(key),
        fieldNameDenormalizer: (key: string) => snake_case(key),

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
            isLoading(false)
        })
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
        link: from([restLink, errorLink, httpLink]),
        cache: new InMemoryCache({})
    })
}


const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'main',
                element: <Main />,
            },
            {
                path: 'home',
                element: <div>Hello world!</div>
            },
            {
                path: 'registration',
                element: <Registration />
            }
        ]
    },
]);

root.render(
    <ApolloProvider client={createApolloClient()}>
        <RouterProvider router={router} />
    </ApolloProvider>
)