import * as React from 'react'
import { socket } from '../../app/socket'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'
import { useSearchImages } from '../../analysis/stores/searchImages'
import { useClassificationConfig } from '../../analysis/stores/classificationConfig'
import { useLoading } from '../../interface/stores/Loading'
import { useClipMask } from '../../analysis/stores/clipMask'
import { useImagesStack } from '../../analysis/stores/imagesStack'

export const CreateAutomationBtn = () => {
    const algName = useCreateAlgorithm(state => state.algName)
    const algType = useCreateAlgorithm(state => state.algType)
    const sensor = useSearchImages(state => state.sensor)
    const poi = useSearchImages(state => state.poi)
    const startDate = useSearchImages(state => state.startDate)
    const endDate = useSearchImages(state => state.endDate)
    const method = useClassificationConfig(state => state.method)
    const classes = useClassificationConfig(state => state.classes)
    const setLoading = useLoading(state => state.setLoading)
    const isLoading = useLoading(state => state.isLoading)
    const mask = useClipMask(state => state.mask)
    const imagesStack = useImagesStack(state => state)

    
    const createBtnHandler = () => {

        let websocketUrl = algType == 'monitoring' ? 'automation/monitoring' : 'automation/data-processing'
        let satellite = sensor == 'S2' ? 'sentinel' : 'landsat' as 'sentinel' | 'landsat'
        let keys = Object.keys(imagesStack[satellite])
        let bands: Array<string> = []
        keys.map(key => bands = imagesStack[satellite][key].meta.bands )

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
    }

    return <div className='col-auto me-3'>
        <button 
        onClick={()=>createBtnHandler()}
        className='btn btn-sm btn-light' type='button' disabled={isLoading}>
            Создать алгоритм <i className="bi bi-arrow-right link-primary"></i>
        </button>
    </div>
}