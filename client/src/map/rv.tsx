import { makeVar } from "@apollo/client";

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

interface sidebar {
    setPOI: boolean,
    show: string,
    title: {
        POI: string
        Clip: string
    }
    description: {
        POI: string
        Clip: string
    }
}
interface sentinel {
    mgrsTile: string
    productId: string
    granuleId: string
    bands: Array<string>
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
    // [satellite: string]: {
    //     [sceneNameId: string]: landsat | sentinel
    // }
}

interface toasts {
    [key: string]: {
        datetime: Date,
        header: string,
        message: string,
        show: boolean
    }
}






export const imagesStack = makeVar({} as imagesStack)
export const selectedImage = makeVar(undefined)
export const mapObj = makeVar({})
export const mapData = makeVar({} as geom)
export const imagePreview = makeVar([])
export const preview = makeVar({} as any)
export const isLoading = makeVar(false)
export const errors = makeVar({period: false})


export const sidebar = makeVar({
    setPOI: false,
    show: 'POI',
    title: {
        POI: 'Выбор спутникого снимка',
        Clip: 'Создать GeoJSON'
    },
    description: {
        POI: 'поиск спутниковых снимков за указанный период на указанной территории',
        Clip: 'создание векторного слоя для кадрирования'
    }
} as sidebar)


export const searchImages = makeVar({
    poi: [],
    period: {
        start: "",
        end: ""
    },
    sensor: "S2",
    images: []
})

export const bands = {
    landsat4and5: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'],
    landsat7: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
    landsat8and9: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'BQA'],
    sentinel2: ['B01', 'B02', 'B03', 'B04', 'B05', 'B06', 'B07', 'B08', 'B8A', 'B09', 'B10', 'B11', 'B12', 'TCI'],
}


export const toasts = makeVar({} as toasts)