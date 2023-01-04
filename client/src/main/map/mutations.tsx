import { gql } from "@apollo/client"


export const DOWNLOAD_SENTINEL = gql`
    mutation download_sentinel_mutation($sentinelMeta: SentinelDownload!, $sensor: String!, $systemIndex: String! $metadata: String!){
        downloadSentinel(sentinelMeta: $sentinelMeta, sensor: $sensor, systemIndex: $systemIndex, metadata: $metadata){
            header,
            message,
            datetime
        }
    }
`

export const DOWNLOAD_LANDSAT = gql`
    mutation download_landsat_mutation($landsatMeta: LandsatDownload!, $sensor: String!, $systemIndex: String! $metadata: String!){
        downloadLandsat(landsatMeta: $landsatMeta, sensor: $sensor, systemIndex: $systemIndex, metadata: $metadata){
            header,
            message,
            datetime
        }
    }
`

export const CLIP_TO_MASK = gql`
    mutation clip__to_mask_mutation($files: [String!]!, $geoJSONs: [GeoJSON!]!){
        clipToMask(files: $files, geoJSONs: $geoJSONs){
            header,
            message,
            datetime
        }
    }
`

export const STACK_BANDS = gql`
    mutation stack_bands_mutation($files: [String!]!){
        stackBands(files: $files){
            header,
            message,
            datetime
        }
    }
`

export const CLASSIFY_K_MEAN = gql`
    mutation classify_k_mean_mutation($filePath: String!, $k: Int!){
        classifyKMean(filePath: $filePath, k: $k){
            header
            message
            datetime
            fileName
            imgUrl
            coordinates
            k
        }
    }
`