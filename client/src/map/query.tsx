import { gql } from "@apollo/client";

export const SEARCH_IMAGES = gql`
    query search_images_query($poi: Coordinates!, $date: Period!, $sensor: String){
        searchImages(poi: $poi, date: $date, sensor: $sensor)
    }
`

export const GET_PREVIEW = gql`
    query get_image_preview_query($systemIndex: String!, $sensor: String!){
        getImagePreview(systemIndex: $systemIndex, sensor: $sensor)
    }
`

export const DOWNLOAD_SENTINEL = gql`
    query download_sentinel_query($sentinelMeta: SentinelDownload!){
        downloadSentinel(sentinelMeta: $sentinelMeta){
            header,
            message,
            datetime
        }
    }
`
export const DOWNLOAD_LANDSAT = gql`
    query download_landsat_query($landsatMeta: LandsatDownload!){
        downloadLandsat(landsatMeta: $landsatMeta){
            header,
            message,
            datetime
        }
    }
`

export const SEND_GEOJSON = gql`
    query send_geojson_query($filePath: String!, $geojson: GeoJSON!){
        clipToMask(filePath: $filePath, geojson: $geojson){
            header,
            message,
            datetime
        }
    }
`

export const AVAILABLE_FILES = gql`
    query availableFiles{
        availableFiles
    }
`