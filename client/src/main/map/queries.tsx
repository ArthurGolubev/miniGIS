import { gql } from "@apollo/client"


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
            sensor
            systemIndex
        }
    }
`

export const AVAILABLE_FILES = gql`
    query available_files_query($to: String!){
        availableFiles(to: $to)
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

