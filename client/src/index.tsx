import * as ReactDOM from "react-dom/client"
import * as React from 'react'
import { HttpLink, ApolloClient, ApolloProvider, InMemoryCache, from, ApolloLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { isLoading, redirectTo, toasts } from "./main/map/rv"
import { RestLink } from "apollo-link-rest"
// import camelCase from 'camelcase'
import { snakeCase  as snake_case } from 'snake-case'
import { GraphQLNetworkError } from "./main/map/types/main/GraphQLNetworkErrorType"
import { router } from "./Router"

const root = ReactDOM.createRoot(document.querySelector("#root"))


const authRestLink = new ApolloLink((operation, forward) => {
    operation.setContext(({headers}: {headers: any}) => {
        const token = `Bearer ${localStorage.getItem("miniGISToken")}`
        return {
            headers: {
                ...headers,
                Accept: 'application/json',
                Authorization: token
            }
        }
    })
    return forward(operation).map(result => {
        const { restResponses } = operation.getContext()
        const authTokenResponse = restResponses.find((res: any) => res.headers.has("Authorization"))
        if (authTokenResponse) {
            localStorage.setItem("miniGISToken", authTokenResponse.headers.get("Authorization"))
        }
        return result
    })
})


const createApolloClient = () => {
    const httpLink = new HttpLink({
        uri: '/api/graphql',
    })

    const restLink = new RestLink({
        uri: "/api/v2-rest",
        endpoints: {token: "/token"},
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

        const errorLink = onError(({graphQLErrors, networkError} ) => {
        if(graphQLErrors){
            console.log('%cERR -> ', 'color: green; background: yellow; font-size: 30px')
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
        let err = networkError as unknown as GraphQLNetworkError
        if(err){
            console.log(networkError)
            toasts({
                [new Date().toLocaleString()]: {
                    header: `Ошибка: ${err.response?.statusText}`,
                    message: `Сообщение: ${err.result?.detail}`,
                    datetime: new Date(),
                    show: true,
                    color: 'text-bg-danger'
                }
            })
            isLoading(false)
            if (err?.statusCode == 401) redirectTo({url: '/authorization'})
        }
    })

    return new ApolloClient({
        link: from([authRestLink, errorLink, restLink, httpLink]),
        cache: new InMemoryCache({})
    })
}




root.render(
    <ApolloProvider client={createApolloClient()}>
        <RouterProvider router={router} />
    </ApolloProvider>
)