import { gql } from "@apollo/client";

export const REGISTRATION = gql`
    mutation registration_mutation($newUser: User1!){
        registration(newUser: $newUser)
        @rest(
            type: "RegistrationType",
            path: "/user/create",
            method: "POST",
            bodyKey: "newUser"
        ){
            id
            username
            email
        }
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

export const GET_ME = gql`
    query get_me_mutation{
        getMe
        @rest(
            type: "getMeType",
            path: "/user/get-me"
            method: "GET"
        ){
            id
            username
            email
            yandexToken
        }
    }
`

export const GET_YANDEX_DISK_AUTH_URL = gql`
    query get_yandex_disk_auth_url_query{
        getYandexDiskAuthUrl
        @rest(
            type: "getYandexDiskAuthUrlType"
            path: "/user/get-yandex-disk-auth-url"
            method: "GET"
        ){
            url
        }
    }
`

export const GET_YANDEX_DISK_TOKEN = gql`
    query get_yandex_disk_token_query{
        getYandexDiskToken(code: $code)
        @rest(
            type: "getYandexDiskTokenType"
            path: "/user/get-yandex-disk-token/{args.code}"
            method: "GET"
        )
    }
`