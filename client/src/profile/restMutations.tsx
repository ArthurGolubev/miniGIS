import { gql } from "@apollo/client";

export const REGISTRATION = gql`
    mutation registration_mutation($newUser: User1!){
        registration(newUser: $newUser)
        @rest(
            type: "RegistrationType",
            path: "/user/create",
            method: "POST",
            bodyKey: "newUser"
        )
    }
`

export const AUTHORIZATION = gql`
    mutation login_for_access_token_from_client_mutation($user: UserAuthorization!){
        loginForAccessTokenFromClient(user: $user)
        @rest(
            type: "AuthorizationType",
            path: "/user/get-token-from-client",
            method: "POST",
            bodyKey: "user"
        ){
            accessToken
            tokenType
        }
    }
`
