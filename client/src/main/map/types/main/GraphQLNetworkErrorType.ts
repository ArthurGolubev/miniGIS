export interface GraphQLNetworkError {
    response: {
        url: string
        ok: boolean
        redirect: boolean
        status: number
        statusText: string
    },
    result: {
        detail: string
    },
    statusCode: number
}