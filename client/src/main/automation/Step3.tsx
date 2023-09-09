import * as React from "react"
import { ClassificationType, unsupervisedType } from "../map/types/interfacesTypeScript"
import { CreateAutomationBtn } from "./CreateAutomationBtn"
import { useClassificationConfig } from "../../analysis/stores/classificationConfig"
import { classificationDescription } from "../../analysis/stores/constants"



export const Step3 = () => {
    const setClasses = useClassificationConfig(state => state.setClasses)
    const setMethod = useClassificationConfig(state => state.setMethod)
    const method = useClassificationConfig(state => state.method)
    

    let param

    switch (method) {
        case 'KMean':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>k:</label>
                    <input className="form-control" type="number" min={1} max={30}
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
                        onChange={e => setClasses(parseInt(e.target.value)) }
                    />
                </div>
            </div>
            break
        default:
            console.log("DEFAULT CASE FROM Automation.tsx -> ", method)
            break;
    }




    return <div className="row justify-content-center">
        <div className='col-12'>
        <figure>
            <blockquote className="blockquote">
                <p>Алгоритм классификации</p>
            </blockquote>
            <figcaption className="blockquote-footer">
                выберите алгоритм классификации, который будет применён к области работы алгоритма
            </figcaption>
        </figure>


            <div className='row justify-content-start mt-2'>
                <div className='col-4'>
                    <select className='form-select form-select-sm'
                        onChange={e => setMethod(e.target.value)} defaultValue={'KMean'}>
                        <option value='KMean'>KMean</option>
                        <option value='BisectingKMean'>BisectingKMean</option>
                        <option value='GaussianMixture'>GaussianMixture</option>
                        <option value='MeanShift'>MeanShift</option>
                    </select>
                </div>
            </div>


            <div className='row justify-content-start mt-2'>
                <div className='col-9'>

                    <div className='row justify-content-start'>
                        <div className='col-12'>
                            { classificationDescription.unsupervised[method as unsupervisedType] }
                        </div>
                    </div>

                    <div className='row justify-content-start'>
                        <div className='col-12'>
                            { param }
                        </div>
                    </div>

                </div>
            </div>

            <div className='row justify-content-center mt-4'>
                <div className='col-12'>
                    <CreateAutomationBtn />
                </div>
            </div>

        </div>
    </div>
}