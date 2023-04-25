import { useReactiveVar } from "@apollo/client"
import * as React from "react"
import { classification, classificationDescription } from "../map/rv"
import { ClassificationType, unsupervisedType } from "../map/types/interfacesTypeScript"
import { CreateAutomationBtn } from "./CreateAutomationBtn"



export const Step3 = () => {
    const classificationDescriptionSub = useReactiveVar(classificationDescription)
    const classificationSub = useReactiveVar(classification) as ClassificationType

    let param

    switch (classificationSub.method) {
        case 'KMean':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>k:</label>
                    <input className="form-control" type="number" min={1} max={30}
                        onChange={e => classification({...classificationSub, classes: parseInt(e.target.value) })}
                    />
                </div>
            </div>
            break
        case 'BisectingKMean':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>k:</label>
                    <input className="form-control" type="number" min={1} max={30}
                        onChange={e => classification({...classificationSub, classes: parseInt(e.target.value) })}
                    />
                </div>
            </div>
            break
        case 'GaussianMixture':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>n components:</label>
                    <input className="form-control" type="number" min={1} max={30}
                        onChange={e => classification({...classificationSub, classes: parseInt(e.target.value) })}
                    />
                </div>
            </div>
            break
        case 'MeanShift':
            param = <div className='col-4'>
                <div className='input-group'>
                    <label className='input-group-text' htmlFor='classes'>n samples:</label>
                    <input className="form-control" type="number" min={1} max={100000}
                        onChange={e => classification({...classificationSub, classes: parseInt(e.target.value) })}
                    />
                </div>
            </div>
            break
        default:
            console.log("DEFAULT CASE FROM Automation.tsx -> ", classificationSub.method)
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
                        onChange={e => classification({...classificationSub, method: e.target.value})} defaultValue={'KMean'}>
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
                            { classificationDescriptionSub.unsupervised[classificationSub.method as unsupervisedType] }
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