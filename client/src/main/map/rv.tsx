import { makeVar } from "@apollo/client"
import { MapLayers } from "./types/main/LayerTypes"
import { MapObject } from "./types/main/MapTypes"
import { ClassificationResultsType, ClassificationType, ImagesStackType, SelectedFilesType, SidebarType, ToastDataType, ToastDataWithImgType, ToastsType, ToolsType } from "./types/interfacesTypeScript"
import * as React from "react"


// TODO Почистить
export const imagesStack = makeVar({} as ImagesStackType)
export const selectedImage = makeVar({metadata: undefined, imgUrl: '', sensor: '', systemIndex: ''})
export const mapObj = makeVar({} as MapObject)
export const imagePreview = makeVar([])
export const isLoading = makeVar(false)
export const errors = makeVar({period: false})

// export const sidebar = makeVar({show: 'tools'} as SidebarType)
export const tools = makeVar({
    setMask: false,
    setPOI: false,
    title: {
        POI: 'Выбор спутникого снимка',
        Clip: 'Создать GeoJSON',
        Stack: 'Объединить слои',
        Classification: 'Классификация',
        Unsupervised: "Unsupervised learning",
        Supervised: "Supervised learning",
        Open: 'Открыть слой'
    },
    description: {
        POI: 'поиск спутниковых снимков за указанный период на указанной территории',
        Clip: 'создание векторного слоя для кадрирования',
        Stack: 'создание композитного изображения из нескольких слоёв (объединение нескольких файлов-слоёв в один файл)',
        Classification: 'классификация без учителя пикселей на изображении',
        Unsupervised: 'класс задач обработки данных, в которых известны только описания множества объектов (обучающей выборки), и требуется обнаружить внутренние закономерности, существующие между объектами',
        Supervised: 'класс задач обработки данных, в которых для каждого обучающего объекта задаётся «правильный ответ», и требуется найти зависимость между объектами и ответами',
        Open: 'добавить слой на карту. Доступны следующие слои: привью скаченного снимка, шейп файлы, результаты классификации'
    }
} as ToolsType)


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


export const toasts = makeVar({} as ToastsType)
export const classification = makeVar({method: 'KMean', classes: 0} as ClassificationType)
export const selectedFiles = makeVar({} as SelectedFilesType)

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
export const redirectTo = makeVar({url: undefined})

export const classificationResponse = makeVar({} as ClassificationResultsType)


export const classificationDescription = makeVar({
    unsupervised: {
        KMean: <p>
            Алгоритм <b>KMeans</b> группирует данные, пытаясь разделить выборки на n групп с одинаковой дисперсией, сводя к минимуму критерий,
            известный как инерция или сумма квадратов внутри кластера (см. ниже). Этот алгоритм требует указания количества кластеров.
            Он хорошо масштабируется для большого количества образцов и используется в самых разных областях применения в самых
            разных областях.
        </p>,
        BisectingKMean: <p>
            Это <b>BisectingKMeans</b> итеративный вариант <b>KMeans</b>, использующий разделительную иерархическую кластеризацию.
            Вместо того, чтобы создавать все центроиды сразу, центроиды выбираются постепенно на основе предыдущей кластеризации:
            кластер многократно разбивается на два новых кластера, пока не будет достигнуто целевое количество кластеров.
            BisectingKMeans более эффективен, чем KMeans при большом количестве кластеров, поскольку он работает только с
            подмножеством данных в каждом делении пополам, но KMeansвсегда работает со всем набором данных.
            Этот вариант более эффективен для агломерационной кластеризации, если количество кластеров невелико
            по сравнению с количеством точек данных.
        </p>,
        GaussianMixture: <p>
            Объект <b>GaussianMixture</b>GaussianMixture реализует алгоритм максимизации ожидания (EM) для подгонки смешанных гауссовских моделей.
            Он также может рисовать эллипсоиды достоверности для многомерных моделей и вычислять байесовский информационный
            критерий для оценки количества кластеров в данных. GaussianMixture.fitПредоставляется метод, который изучает гауссовскую
            модель смеси из данных поезда . Имея тестовые данные, он может присвоить каждой выборке гауссову диаграмму, которой она,
            скорее всего, принадлежит, используя метод GaussianMixture.predict.
            Поставляется GaussianMixtureс различными вариантами ограничения ковариации оцениваемых классов разности: сферическая,
            диагональная, связанная или полная ковариация.            
        </p>,
        MeanShift: <p>
            <b>MeanShift</b> кластеризация направлена ​​на обнаружение пятен в равномерной плотности образцов.
            Это алгоритм, основанный на центроидах, который работает путем обновления кандидатов на центроиды,
            чтобы они были средним значением точек в заданной области. Затем эти кандидаты фильтруются на этапе постобработки,
            чтобы исключить почти дубликаты и сформировать окончательный набор центроидов.            
        </p>
    }
})