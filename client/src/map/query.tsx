import { gql } from "@apollo/client";

export const SEARCH_IMAGES = gql`
    query searchImages($poi: Coordinates!, $date: Period!, $sensor: String){
        searchImages(poi: $poi, date: $date, sensor: $sensor)
    }
`