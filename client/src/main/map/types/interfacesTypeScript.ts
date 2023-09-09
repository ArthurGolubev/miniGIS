export interface SioType {
    on: (event: string, response: (data: string) => void) => void
    emit: (event: string, payload: {}) => void
}


export interface ToolsType {
    setMask: boolean,
    setPOI: boolean,
    // show: "POI" | "Clip" | "Stack" | "Classification" | "Open" | "Unsupervised" | "Supervised",
    title: {
        POI: string
        Clip: string
        Stack: string
        Classification: string
        Unsupervised: string
        Supervised: string
        Open: string
    }
    description: {
        POI: string
        Clip: string
        Stack: string
        Classification: string
        Unsupervised: string
        Supervised: string
        Open: string
    }
}

export interface ImagesStackType {
    sentinel: {
        [sceneNameId: string]: {
            meta: {
                mgrsTile: string
                productId: string
                granuleId: string
                bands: Array<string>
            }
            status: "wait" | "loading" | "downloaded"
        } | {
            meta: {
                bands: Array<string>
            }
        }
    },
    landsat: {
        [sceneNameId: string]: {
            meta: {
                sensorId: string
                path: string
                row: string
                productId: string
                bands: Array<string>
            }
            status: "wait" | "loading" | "downloaded"
        } | {
            meta: {
                bands: Array<string>
            }
        }
    }
}

export interface SelectedFilesType {
    satellite: string
    product: string
    // files: {
    //     POI: Array<string>
    //     Stack: Array<string>
    //     Clip: Array<string>
    //     Classification: Array<string>
    //     Open: Array<string>
    //     Unsupervised: Array<string>
    //     Supervised: Array<string>
    // }
    files: any
}

export interface ClassificationType {
    method: string
    classes: number
}

export interface SidebarType {
    show: 'tools' | 'layers'
}

export interface SatelliteImageType {
    layer: any
    type: string
    date: string
    cloud: string
    positionInTable: number
}

// export interface LayersType {
//     [key: string]: SatelliteImage | geom
// }

export type unsupervisedType =  'KMean' | 'BisectingKMean' | 'GaussianMixture' | 'MeanShift'