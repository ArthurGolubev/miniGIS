import { gql } from "@apollo/client";

export const REGISTRATION = gql`
    mutation registration_mutation($login: String!, $password: String!){
        registration(login: $login, password: $password)
    }
`

export const TEST_REST_API = gql`
    mutation test_rest_api_mutation($q: String!){
            someRead(body: $q)
            @rest(
                type: "[SomeType]",
                path: "/123",
                method: "POST",
                bodyKey: "body"
            ){
            username
        }
    }
`

export const TEST_REST_API_2 = gql`
    mutation DeletePost($id: ID!) {
        deletePostResponse(id: $id)
            @rest(type: "Post", path: "/posts/{args.id}", method: "DELETE") {
            NoResponse
        }
    }
`

export const TEST_REST_API_3 = gql`
    mutation TestSomeRestApi($input: In!){
        awesomeParam(input: $input)
            @rest(
                type: "Post",
                path: "/awesome",
                method: "POST",
                bodyKey: "input"
                ) {
            NoResponse
        }
    }
`