
import * as React from 'react'
import { SearchImages } from '../map/sidebar/tools/POI/SearchImages'
import { useNavigate } from 'react-router-dom'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'
// import { useSteps } from '../../analysis/stores/createAlgorithm'


export const Step1 = () => {
    const redirect = useNavigate()
    const setStep = useCreateAlgorithm(state => state.setStep)

    const nextStep = () => {
        setStep(2)
        redirect('/main/automation/step-2')
    }

    return <div className='row justify-content-start mt-3'>
        <div className='col-12'>
            <figure>
                <blockquote className="blockquote">
                    <p>Выбор слоёв</p>
                </blockquote>
                <figcaption className="blockquote-footer">
                    просмотрите привью территории и выберете слои, которые будут использоваться в алгоритме работы. 
                    <b> Если тип алгоритма работы выбран "обработка маиссва данных", то для алгоритма работы будет использоваться указанный период</b>
                </figcaption>
            </figure>
            
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <SearchImages />        
                </div>
            </div>

            <div className='row justify-content-center mt-4'>
                <div className='col-12'>
                    <div className='col-auto me-3'>
                        <button 
                        onClick={()=>nextStep()}
                        className='btn btn-sm btn-light' type='button'>
                            Далее <i className="bi bi-arrow-right link-primary"></i>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
}