import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { classification } from '../../../rv'
import { AvailableFiles } from '../AvailableFiles'
import { KMean } from './options/KMean'


export const Classification = () => {
    const classificationSub = useReactiveVar(classification)

    return <div className="row justify-content-center">
        <div className='col-11'>
            <p>Метод классификации</p>
            <select className='form-select mb-2'
                onChange={e => classification({...classificationSub, method: e.target.value})}
            >
                <option>...</option>
                <option value={"KMean"}>k-mean</option>
            </select>
            <AvailableFiles />
            {classificationSub.method == 'KMean' && <KMean />}
            <button onClick={()=>console.log(classificationSub)} className='btn btn-sm btn-success' type='button'>classificationSub</button>
        </div>
    </div>
} 