import * as React from 'react'
import { socket } from '../../app/socket'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'
import { useSearchImages } from '../../analysis/stores/searchImages'
import { useClassificationConfig } from '../../analysis/stores/classificationConfig'
import { useLoading } from '../../interface/stores/Loading'
import { useClipMask } from '../../analysis/stores/clipMask'
import { useImagesStack } from '../../analysis/stores/imagesStack'
import { useToasts } from '../../interface/stores/Toasts'

export const CreateAutomationBtn = () => {
    const imagesStack = useImagesStack()
    const {algName, algType} = useCreateAlgorithm()
    const {sensor, poi, startDate, endDate} = useSearchImages()
    const {method, classes} = useClassificationConfig()
    const {setLoading, isLoading} = useLoading()
    const {mask} = useClipMask()
    const {setToast} = useToasts()


    const checkValidAndSand = () => {
        let satellite: 'sentinel' | 'landsat'
        let websocketUrl
        let bands: Array<string> = []
        let emptyFields = []  


        if(algType == undefined ){emptyFields.push('Тип алгоритма не указан')}
        else{websocketUrl = algType == 'monitoring' ? 'automation/monitoring' : 'automation/data-processing'}

        if(sensor == undefined ){emptyFields.push('Сенсор не указан')}
        else{
            satellite = sensor == 'S2' ? 'sentinel' : 'landsat' as 'sentinel' | 'landsat'
            let keys = Object.keys(imagesStack[satellite])
            keys.map(key => bands = imagesStack[satellite][key].meta.bands )
        }

        if(poi.length < 2) emptyFields.push('Точка на местности не указана')
        if(startDate === undefined) emptyFields.push('Начальная дата не указана')
        if(endDate === undefined) emptyFields.push('Конечная дата не указана')
        if(bands.length === 0) emptyFields.push('Не указаны слои')
        if(mask === undefined) emptyFields.push('Маска не указана')
        if(method === undefined) emptyFields.push('Метод классификации не указан')
        if(classes === 0) emptyFields.push('Параметр для классификации не указан')
        if(algName === undefined) emptyFields.push('Название алгоритма не указано')
        if(algType === undefined) emptyFields.push('Тип алгоритма не указан')

        if(emptyFields.length === 0){
            let msg = {
                poi: {lat: poi[1], lon: poi[0]},
                date: {startDate: startDate, endDate: endDate},
                sensor: sensor,
                bands: bands,
                mask: mask,
                alg: method,
                param: classes,
                algName: algName,
                algType: algType
            }
            socket.emit(websocketUrl, msg)
            setLoading(true)
        } else {
            setToast({[new Date().toLocaleString()]: {
                header: `Не указаны следующие поля`,
                message: emptyFields.join('\n'),
                show: true,
                datetime: new Date(),
                color: 'text-bg-warning'
            }})
        }
    }

    return <div className='col-auto me-3' data-testid='CreateAutomationBtn'>
        <button 
        data-testid='create-automation-btn'
        onClick={()=>checkValidAndSand()}
        className='btn btn-sm btn-light' type='button' disabled={isLoading}>
            Создать алгоритм <i className="bi bi-arrow-right link-primary"></i>
        </button>
    </div>
}