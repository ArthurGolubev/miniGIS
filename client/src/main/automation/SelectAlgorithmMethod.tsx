import * as React from 'react'
import { useClassificationConfig } from '../../analysis/stores/classificationConfig'
import { useToasts } from '../../interface/stores/Toasts'

export const SelectAlgorithmMethod = () => {
    let param
    const setClasses = useClassificationConfig(state => state.setClasses)
    const method = useClassificationConfig(state => state.method)
    const setToast = useToasts(state => state.setToast)

    const paramValidator = (min: number, max: number, paramValue: number) => {
        let bringToast = () => setToast({[new Date().toLocaleString()]: {
            header: `Указано значение ${paramValue}`,
            message: `Значение должно быть не ниже ${min} и не выше ${max}`,
            show: true,
            datetime: new Date(),
            color: 'text-bg-warning'
        }})

        if(min <= paramValue && paramValue <= max){
            return setClasses(paramValue)
        } else if(paramValue < min){
            (document.querySelector('#input-param') as HTMLInputElement ).value = min.toString()
            bringToast()
            return setClasses(min)
        } else if (paramValue > max){
            (document.querySelector('#input-param') as HTMLInputElement ).value = max.toString()
            bringToast()
            return setClasses(max)
        }
    }

    switch (method) {
        case 'KMean':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>k:</label>
                    <input className="form-control" type="number" min={1} max={30}
                        data-testid={'KMean input'}
                        id="input-param"
                        onChange={e => paramValidator(1, 30, parseInt(e.target.value)) }
                    />
                </div>
            </div>
            break
        case 'BisectingKMean':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>k:</label>
                    <input className="form-control" type="number" min={1} max={30}
                        data-testid={'BisectingKMean input'}
                        id="input-param"
                        onChange={e => paramValidator(1, 30, parseInt(e.target.value))}
                    />
                </div>
            </div>
            break
        case 'GaussianMixture':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>n components:</label>
                    <input className="form-control" type="number" min={1} max={30}
                        data-testid={'GaussianMixture input'}
                        id="input-param"
                        onChange={e => paramValidator(1, 30, parseInt(e.target.value)) }
                    />
                </div>
            </div>
            break
        case 'MeanShift':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>n samples:</label>
                    <input className="form-control" type="number" min={1} max={100000}
                        data-testid={'MeanShift input'}
                        id="input-param"
                        onChange={e => paramValidator(1, 100000, parseInt(e.target.value)) }
                    />
                </div>
            </div>
            break
        default:
            console.log("DEFAULT CASE FROM Automation.tsx -> ", method)
            break;
    }


    return <div data-testid='SelectAlgorithmMethod'>{param}</div> 
}