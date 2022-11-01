import { gql } from "@apollo/client";


export const SEARCH_IMAGES = gql`
    query search_images_query($poi: Coordinates!, $date: Period!, $sensor: String){
        searchImages(poi: $poi, date: $date, sensor: $sensor)
    }
`

export const DOWNLOAD_IMAGES = gql`
    query download_images_query($images: [Images!]!){
        downloadImages(images: $images)
    }
`

export const GET_PREVIEW = gql`
    query get_image_preview_query($systemIndex: String!, $sensor: String!){
        getImagePreview(systemIndex: $systemIndex, sensor: $sensor)
    }
`