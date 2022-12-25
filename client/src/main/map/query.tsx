import { gql } from "@apollo/client";


export const SEARCH_IMAGES = gql`
    query search_images_query($poi: Coordinates!, $date: Period!, $sensor: String){
        searchImages(poi: $poi, date: $date, sensor: $sensor){
            images,
            header,
            message,
            datetime
        }
    }
`

export const GET_PREVIEW = gql`
    query get_image_preview_query($systemIndex: String!, $sensor: String!){
        getImagePreview(systemIndex: $systemIndex, sensor: $sensor){
            imgUrl,
            header,
            message,
            datetime
        }
    }
`

export const DOWNLOAD_SENTINEL = gql`
    query download_sentinel_query($sentinelMeta: SentinelDownload!, $previewUrl: String!, $metadata: String!){
        downloadSentinel(sentinelMeta: $sentinelMeta, previewUrl: $previewUrl, metadata: $metadata){
            header,
            message,
            datetime
        }
    }
`
export const DOWNLOAD_LANDSAT = gql`
    query download_landsat_query($landsatMeta: LandsatDownload!, $previewUrl: String!, $metadata: String!){
        downloadLandsat(landsatMeta: $landsatMeta, previewUrl: $previewUrl, metadata: $metadata){
            header,
            message,
            datetime
        }
    }
`

export const CLIP_LAYERS = gql`
    query send_geojson_query($files: [String!]!, $geoJSONs: [GeoJSON!]!){
        clipToMask(files: $files, geoJSONs: $geoJSONs){
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

export const GET_CLASSIFICATION_LAYER = gql`
    query get_classification_layer_query($filePath: String!){
        getClassificationLayer(filePath: $filePath)
    }
`

export const TREE_AVAILABLE_FILES = gql`
    query tree_available_files_query{
        treeAvailableFiles
    }
` 

export const ADD_LAYER = gql`
    query add_layer_query($scope: String! $satellite: String! $product: String!, $target: String!){
        addLayer(scope: $scope, satellite: $satellite, product: $product, target: $target){
            header
            message
            datetime
            imgUrl
            metadata
        }
    }
`

export const SHP_SAVE = gql`
    query shp_save_query($shpName: String!, $layer: JSON!){
        shpSave(shpName: $shpName, layer: $layer)
    }
`

export const SHP_READ = gql`
    query shp_read_query($shpName: String!){
        shpRead(shpName: $shpName)
    }
`
// export const TEST_SHP = gql`
//     query test_shp_query{
//         shpRead
//     }
// `

// export const TEST_SHP_2 = gql`
//     query test_shp_2_query($shpData: String!, $shpName: String!){
//         shpSave(shpData: $shpData, shpName: $shpName)
//     }
// `
