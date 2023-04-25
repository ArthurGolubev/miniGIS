import * as React from 'react'
import { SearchImages } from '../map/sidebar/tools/POI/SearchImages'
import { useReactiveVar } from '@apollo/client'
import { algName, algType, automationStep } from './rv'
import { useNavigate } from 'react-router'


export const Step0 = () => {
    const redirect = useNavigate()
    const algTypeSub = useReactiveVar(algType)

    const nextStep = () => {
        automationStep(1)
        redirect('/main/automation/step-1')
    }

    return <div className='row justify-content-start mt-3'>
        <div className='col-12'>
            <figure>
                <blockquote className="blockquote">
                    <p>Тип алгоритма</p>
                </blockquote>
                <figcaption className="blockquote-footer">
                    укажите тип алгоритма действий программы
                </figcaption>
            </figure>
            
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <div className="form-check">
                        <input
                        className="form-check-input"
                        type="radio"
                        name="processDataArray"
                        id="processDataArray"
                        value="dataProcessing"
                        onChange={()=>algType('dataProcessing')}
                        checked={algTypeSub == 'dataProcessing'}
                        />
                        <label className="form-check-label" htmlFor="processDataArray">Обработка массива данных по алгоритму за период</label>
                    </div>
                    <div className="form-check">
                        <input
                        className="form-check-input"
                        type="radio"
                        name="monioringAndProcessingData"
                        id="monioringAndProcessingData"
                        checked={algTypeSub == 'monitoring'}
                        onChange={()=>algType('monitoring')}
                        />
                        <label className="form-check-label" htmlFor="monioringAndProcessingData">Мониторинг и обработка данных по алгоритму</label>
                    </div>   
                </div>
            </div>

            <div className='row justify-content-start mt-3'>
                <div className='col-8'>
                    <input className='form-control' placeholder='Название папки на Яндекс диске' onChange={e => algName(e.target.value)}/>
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