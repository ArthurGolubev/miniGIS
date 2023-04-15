import { ApolloLink, HttpLink, split } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { RestLink } from "apollo-link-rest"
import { isLoading, redirectTo, toasts } from "./main/map/rv"
import { GraphQLNetworkError } from "./main/map/types/main/GraphQLNetworkErrorType"
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { snakeCase  as snake_case } from 'snake-case'
import { getMainDefinition } from '@apollo/client/utilities'








const httpLink = new HttpLink({
    uri: '/api/graphql',
})



export const authRestLink = new ApolloLink((operation, forward) => {
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



export const errorLink = onError(({graphQLErrors, networkError} ) => {
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


const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://10.152.183.82:80/ws',
    connectionParams: {
        authToken: `Bearer ${localStorage.getItem("miniGISToken")}`
    }
}))



export const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    restLink,
);