

// export const SEARCH_PREVIEW = gql`
//     query search_preview_query($input: SearchPreview!){
//         searchPreview(input: $input)
//         @rest(
//             type: "SearchPreviewType",
//             path: "/workflow/search-preview",
//             method: "POST",
//             bodyKey: "input",
//         )
//         {
//             images,
//             header,
//             message,
//             datetime
//         }
//     }
// `

// export const GET_PREVIEW = gql`
//     query get_image_preview_query($systemIndex: String!, $sensor: String!){
//         getImagePreview(systemIndex: $systemIndex, sensor: $sensor)
//         @rest(
//             type: "GetImagePreviewType",
//             path: "/workflow/get-image-preview/{args.sensor}/{args.systemIndex}",
//             method: "GET",
//         )
//         {
//             imgUrl,
//             header,
//             message,
//             datetime,
//             sensor,
//             systemIndex,
//             bounds
//         }
//     }
// `

// export const AVAILABLE_FILES = gql`
//     query available_files_query($to: String!){
//         availableFiles(to: $to)
//         @rest(
//             type: "AvailableFilesType",
//             path: "/workflow/available-files/{args.to}",
//             method: "GET",
//         ){
//             items @type(name: "AvailableFile")
//         }
//     }
// `

// export const TREE_AVAILABLE_FILES = gql`
//     query tree_available_files_query{
//         treeAvailableFiles
//         @rest(
//             type: "TreeAvailableFiles",
//             path: "/workflow/tree-available-files",
//             method: "GET",
//         ){
//             items @type(name: "TreeAvailableFiles")
//         }
//     }
// `

// export const ADD_LAYER = gql`
//     query add_layer_query($input: AddLayerOptions!){
//         addLayer(input: $input)
//         @rest(
//             type: "AddLayerType",
//             path: "/workflow/add-layer",
//             method: "POST"
//             bodyKey: "input"
//         )
//         {
//             header
//             message
//             datetime
//             imgUrl
//             meta
//         }
//     }
// `

// export const SHP_SAVE = gql`
//     query shp_save_query($input: ShpSave!){
//         shpSave(input: $input)
//         @rest(
//             type: "ShpSaveType",
//             path: "/workflow/shp-save",
//             method: "POST"
//             bodyKey: "input"
//         )
//     }
// `

// export const SHP_READ = gql`
//     query shp_read_query($input: ShpRead!){
//         shpRead(input: $input)
//         @rest(
//             type: "ShpReadType",
//             path: "/workflow/shp-read",
//             method: "POST",
//             bodyKey: "input"
//         ){
//             bbox
//             features
//             type
//         }
//     }
// `
