// Depricated
// import { automationStep } from './rv'

import * as React from 'react'
import { ClipBtn } from '../map/sidebar/tools/clip/ClipBtn'
import { useNavigate } from 'react-router'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'


export const Step2 = () => {
    const redirect = useNavigate()
    const setStep = useCreateAlgorithm(state => state.setStep)

    const nextStep = () => {
        setStep(3)
        redirect('/main/automation/step-3')
    }

    return <div className='row justify-content-start mt-3'>
        <div className='col-12'>
            <figure>
                <blockquote className="blockquote">
                    <p>Область работы</p>
                </blockquote>
                <figcaption className="blockquote-footer">
                    укажите область для работы алгоритма
                </figcaption>
            </figure>

            <div className='row justify-content-start'>
                <div className='col-auto'>
                    <ClipBtn />
                </div>
            </div>

            <div className='row justify-content-center mt-4'>
                <div className='col-12'>
                    <div className='col-auto me-3'>
                        <button 
                        data-testid='step2-next-btn'
                        onClick={()=>nextStep()}
                        className='btn btn-sm btn-light'
                        type='button'>
                            Далее <i className="bi bi-arrow-right link-primary"></i>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
}