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

export const CLIP_LAYERS = gql`
    query send_geojson_query($files: [String!]!, $geojson: GeoJSON!){
        clipToMask(files: $files, geojson: $geojson){
            header,
            message,
            datetime
        }
    }
`

export const AVAILABLE_FILES = gql`
    query available_files_query($to: String!){
        availableFiles(to: $to)
    }
`

export const STACK_BANDS = gql`
    query stack_bands_query($files: [String!]!){
        stackBands(files: $files){
            header,
            message,
            datetime
        }
    }
`

export const CLASSIFY_K_MEAN = gql`
    query classify_k_mean_query($filePath: String!, $k: Int!){
        classifyKMean(filePath: $filePath, k: $k){
            header,
            message,
            datetime
        }
    }
`

export const GET_CLASSIFICATION_LAYER = gql`
    query get_classification_layer_query($filePath: String!){
        getClassificationLayer(filePath: $filePath)
    }
`