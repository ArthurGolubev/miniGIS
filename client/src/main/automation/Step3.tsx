import * as React from "react"
import { unsupervisedType } from "../map/types/interfacesTypeScript"
import { CreateAutomationBtn } from "./CreateAutomationBtn"
import { useClassificationConfig } from "../../analysis/stores/classificationConfig"
import { classificationDescription } from "../../analysis/stores/constants"
import { SelectAlgorithmMethod } from "./SelectAlgorithmMethod"



export const Step3 = () => {
    const setMethod = useClassificationConfig(state => state.setMethod)
    const method = useClassificationConfig(state => state.method)


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
                        data-testid='select-method-classification'
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
                        <div className='col-12' data-testid="classification-description">
                            { classificationDescription.unsupervised[method as unsupervisedType] }
                        </div>
                    </div>

                    <div className='row justify-content-start'>
                        <div className='col-12'>
                            <SelectAlgorithmMethod />
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