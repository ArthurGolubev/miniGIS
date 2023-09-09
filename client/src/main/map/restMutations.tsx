

// export const DOWNLOAD_SENTINEL = gql`
//     mutation download_sentinel_mutation($input: DownloadSentinel!) {
//         downloadSentinel(input: $input)
//         @rest(
//             type: "DownloadSentinelType",
//             path: "/workflow/download-sentinel",
//             method: "POST",
//             bodyKey: "input"
//         )
//         {
//             header,
//             message,
//             datetime
//         }
//     }
// `

// export const DOWNLOAD_LANDSAT = gql`
//     mutation download_landsat_mutation($input: DownloadLandsat!) {
//         downloadLandsat(input: $input)
//         @rest(
//             type: "DownloadLandsatType",
//             path: "/workflow/download-landsat",
//             method: "POST",
//             bodyKey: "input"
//         )
//         {
//             header,
//             message,
//             datetime
//         }
//     }
// `

// export const CLIP_TO_MASK = gql`
//     mutation clip_to_mask_mutation($input: ClipToMask!){
//         clipToMask (input: $input)
//         @rest(
//             type: "ClipToMaskType",
//             path: "/workflow/clip-to-mask",
//             method: "POST",
//             bodyKey: "input"
//         )
//         {
//             header,
//             message,
//             datetime
//         }
//     }
// `

// export const STACK_BANDS = gql`
//     mutation stack_bands_mutation($files: [String!]!){
//         stackBands(files: $files)
//         @rest(
//             type: "StackBands",
//             path: "/workflow/stack-bands",
//             method: "POST",
//             bodyKey: "files"
//         )
//         {
//             header,
//             message,
//             datetime
//         }
//     }
// `

// export const CLASSIFY_K_MEAN = gql`
//     mutation classify_k_mean_mutation($options: KMeanOptions!){
//         classifyKMean(options: $options)
//         @rest(
//             type: "ClassificationKMean",
//             path: "/workflow/classification/unsupervised/k-mean",
//             method: "POST",
//             bodyKey: "options"
//         )
//         {
//             header
//             message
//             datetime
//             fileName
//             imgUrl
//             coordinates
//             k
//         }
//     }
// `

// export const CLASSIFY_BISECTING_KMEAN = gql`
//     mutation classify_bisecting_kmean_mutation($options: KMeanOptions!){
//         classifyBisectingKMean(options: $options)
//         @rest(
//             type: "ClassificationBisectingKMean",
//             path: "/workflow/classification/unsupervised/bisecting-kmean",
//             method: "POST",
//             bodyKey: "options"
//         )
//         {
//             header
//             message
//             datetime
//             fileName
//             imgUrl
//             coordinates
//             k
//         }
//     }
// `

// export const CLASSIFY_GAUSSIAN_MIXTURE = gql`
//     mutation classify_gaussian_mixture_mutation($options: KMeanOptions!){
//         classifyGaussianMixture(options: $options)
//         @rest(
//             type: "ClassificationBisectingKMean",
//             path: "/workflow/classification/unsupervised/gaussian-mixture",
//             method: "POST",
//             bodyKey: "options"
//         )
//         {
//             header
//             message
//             datetime
//             fileName
//             imgUrl
//             coordinates
//             k
//         }
//     }
// `

// export const CLASSIFY_MEAN_SHIFT = gql`
//     mutation classify_mean_shift_mutation($options: KMeanOptions!){
//         classifyMeanShift(options: $options)
//         @rest(
//             type: "ClassificationMeanShift",
//             path: "/workflow/classification/unsupervised/mean-shift",
//             method: "POST",
//             bodyKey: "options"
//         )
//         {
//             header
//             message
//             datetime
//             fileName
//             imgUrl
//             coordinates
//             k
//         }
//     }
// `