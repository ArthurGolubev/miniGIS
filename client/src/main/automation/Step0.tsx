import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'


export const Step0 = () => {
    const navigate = useNavigate()
    const setStep = useCreateAlgorithm(state => state.setStep)
    const setAlgName = useCreateAlgorithm(state => state.setAlgName)
    const algType = useCreateAlgorithm(state => state.algType)
    const setAlgType = useCreateAlgorithm(state => state.setAlgType)

    const nextStep = () => {
        setStep(1)
        navigate('/main/automation/step-1')
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
                        data-testid='radio check dataProcessing'
                        className="form-check-input"
                        type="radio"
                        name="processDataArray"
                        id="processDataArray"
                        value="dataProcessing"
                        onChange={()=>setAlgType('dataProcessing')}
                        checked={algType == 'dataProcessing'}
                        />
                        <label className="form-check-label" htmlFor="processDataArray">Обработка массива данных по алгоритму за период</label>
                    </div>
                    <div className="form-check">
                        <input
                        data-testid='radio check monitoring'
                        className="form-check-input"
                        type="radio"
                        name="monioringAndProcessingData"
                        id="monioringAndProcessingData"
                        onChange={()=>setAlgType('monitoring')}
                        checked={algType == 'monitoring'}
                        />
                        <label className="form-check-label" htmlFor="monioringAndProcessingData">Мониторинг и обработка данных по алгоритму</label>
                    </div>   
                </div>
            </div>

            <div className='row justify-content-start mt-3'>
                <div className='col-8'>
                    <input
                        data-testid='algorithm name input'
                        className='form-control'
                        placeholder='Название папки на Яндекс диске'
                        onChange={e => setAlgName(e.target.value)}
                        />
                </div>
            </div>

            <div className='row justify-content-center mt-4'>
                <div className='col-12'>
                    <div className='col-auto me-3'>
                        <button 
                        data-testid='next-btn'
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