import { makeVar } from "@apollo/client"
import { MapLayers } from "./types/main/LayerTypes"
import { MapObject } from "./types/main/MapTypes"


// TODO Почистить
export const imagesStack = makeVar({} as imagesStack)
export const selectedImage = makeVar({metadata: undefined, imgUrl: '', sensor: '', systemIndex: ''})
export const mapObj = makeVar({} as MapObject)
export const imagePreview = makeVar([])
export const isLoading = makeVar(false)
export const errors = makeVar({period: false})

export const sidebar = makeVar({show: 'tools'} as sidebar)
export const tools = makeVar({
    setMask: false,
    setPOI: false,
    show: 'POI',
    title: {
        POI: 'Выбор спутникого снимка',
        Clip: 'Создать GeoJSON',
        Stack: 'Объединить слои',
        Classification: 'Классификация',
        Open: 'Открыть слой'
    },
    description: {
        POI: 'поиск спутниковых снимков за указанный период на указанной территории',
        Clip: 'создание векторного слоя для кадрирования',
        Stack: 'создание композитного изображения из нескольких слоёв (объединение нескольких файлов-слоёв в один файл)',
        Classification: 'классификация без учителя пикселей на изображении',
        Open: 'добавить слой на карту. Доступны следующие слои: привью скаченного снимка, шейп файлы, результаты классификации'
    }
} as tools)


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
export const classification = makeVar({} as classification)
export const selectedFiles = makeVar({} as selectedFiles)

export const layers = makeVar({} as MapLayers)
export const shapeEdit = makeVar('')

export const selectedVecLay = makeVar('')
export const selectedRasterLay = makeVar('')
export const mapLayerControl = makeVar('')

export const showToggle = makeVar({
    LayerList: false,
    DetailVec: false,
    DetailRaster: false,
})

export const clipMask = makeVar({layer: undefined, mask: {}})

export const treeAvailableFiles = makeVar({} as any)