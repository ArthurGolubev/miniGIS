import * as ReactDOM from "react-dom/client"
import * as React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache, from } from '@apollo/client'
import { RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { router } from "./Router"
import { authRestLink, errorLink, splitLink} from "./link"
import axios from "axios"


const root = ReactDOM.createRoot(document.querySelector("#root"))


export const ax = axios.create({
    baseURL: 'http://10.152.183.45/api/v2-rest', // dev
    // baseURL: 'https://ak.in-arthurs-apps.space', // prod
    headers: {
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("miniGISToken")}`
    }
})

const createApolloClient = () => {

    return new ApolloClient({
        link: from([authRestLink, errorLink, splitLink]),
        cache: new InMemoryCache({})
    })
}




root.render(
    <ApolloProvider client={createApolloClient()}>
        <RouterProvider router={router} />
    </ApolloProvider>
)