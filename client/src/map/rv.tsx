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
        Crop: string
    }
    description: {
        POI: string
        Crop: string
    }
}

interface downloadImages {
    [sceneNameId: string]: Array<string>
}




export const searchImages = makeVar({
    poi: [],
    period: {
        start: "",
        end: ""
    },
    sensor: "S2",
    images: []
})


export const downloadImages = makeVar({} as downloadImages)

export const metadataImage = makeVar(undefined)

export const mapObj = makeVar({})
export const mapData = makeVar({} as geom)
export const sidebar = makeVar({
    setPOI: false,
    show: 'POI',
    title: {
        POI: 'Выбор спутникого снимка',
        Crop: "Кадрирование"
    },
    description: {
        POI: 'поиск спутниковых снимков за указанный период на указанной территории',
        Crop: ""
    }
} as sidebar)

export const errors = makeVar({
    period: false
})

export const imagePreview = makeVar([])

export const preview = makeVar({} as any)