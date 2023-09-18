import * as React from 'react'
import { useClassificationConfig } from '../../analysis/stores/classificationConfig'

export const SelectAlgorithmMethod = () => {
    let param
    const setClasses = useClassificationConfig(state => state.setClasses)
    const method = useClassificationConfig(state => state.method)

    switch (method) {
        case 'KMean':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>k:</label>
                    <input className="form-control" type="number" min={1} max={30}
                        data-testid={'KMean input'}
                        onChange={e => setClasses(parseInt(e.target.value)) }
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
                        onChange={e => setClasses(parseInt(e.target.value))}
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
                        onChange={e => setClasses(parseInt(e.target.value)) }
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
                        onChange={e => setClasses(parseInt(e.target.value)) }
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