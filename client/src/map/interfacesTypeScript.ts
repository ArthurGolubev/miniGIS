

interface geom {
    [index: number]: {
        shape: string
        outer_vertex: number
        inner_vertex?: number | undefined
        text: string,
        geom: any
    },
    poi?: {
        lat: string,
        lon: string
    }
}

interface tools {
    setPOI: boolean,
    show: "POI" | "Clip" | "Stack" | "Classification" | "View",
    title: {
        POI: string
        Clip: string
        Stack: string
        Classification: string
    }
    description: {
        POI: string
        Clip: string
        Stack: string
        Classification: string
    }
}

interface imagesStack {
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

interface toasts {
    [key: string]: {
        datetime: Date,
        header: string,
        message: string,
        show: boolean
    }
}

interface selectedFiles {
    satellite: string
    product: string
    files: {
        POI: Array<string>
        Stack: Array<string>
        Clip: Array<string>
        Classification: Array<string>
        View: Array<string>
    }
}

interface classification {
    method: string
    classes: number
}

interface sidebar {
    show: 'tools' | 'layers'
}