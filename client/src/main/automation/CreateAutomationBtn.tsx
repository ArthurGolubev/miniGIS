import * as React from 'react'
import { socket } from '../../app/socket'
import { useReactiveVar } from '@apollo/client'
import { classification, clipMask, imagesStack, isLoading, searchImages } from '../map/rv'
import { algName, algType } from './rv'

export const CreateAutomationBtn = () => {
    const searchImagesSub = useReactiveVar(searchImages)
    const imagesStackSub = useReactiveVar(imagesStack)
    const algTypeSub = useReactiveVar(algType)
    const clipMaskSub = useReactiveVar(clipMask)
    const classificationSub = useReactiveVar(classification)
    const algNameSub = useReactiveVar(algName)
    const isLoadingSub = useReactiveVar(isLoading)

    
    const createBtnHandler = () => {

        let websocketUrl = algTypeSub == 'monitoring' ? 'automation/monitoring' : 'automation/data-processing'
        let satellite = searchImagesSub.sensor == 'S2' ? 'sentinel' : 'landsat' as 'sentinel' | 'landsat'
        let keys = Object.keys(imagesStackSub[satellite])
        let bands: Array<string> = []
        keys.map(key => bands = imagesStackSub[satellite][key].meta.bands )

        let msg = {
            poi: {lat: searchImagesSub.poi[1], lon: searchImagesSub.poi[0]},
            date: {startDate: searchImagesSub.period.start, endDate: searchImagesSub.period.end},
            sensor: searchImagesSub.sensor,
            bands: bands,
            mask: clipMaskSub.mask,
            alg: classificationSub.method,
            param: classificationSub.classes,
            algName: algNameSub,
            algType: algTypeSub
        }
        socket.emit(websocketUrl, msg)
        isLoading(true)
    }

    return <div className='col-auto me-3'>
        <button 
        onClick={()=>createBtnHandler()}
        className='btn btn-sm btn-light' type='button' disabled={isLoadingSub}>
            Создать алгоритм <i className="bi bi-arrow-right link-primary"></i>
        </button>
    </div>
}