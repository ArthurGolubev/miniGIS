import * as ReactDOM from "react-dom/client"
import * as React from 'react'
import { ApolloClient, ApolloProvider, InMemoryCache, from } from '@apollo/client'
import { RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import "bootstrap-icons/font/bootstrap-icons.css"
import { router } from "./Router"
import { authRestLink, errorLink, splitLink} from "./link"

const root = ReactDOM.createRoot(document.querySelector("#root"))




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