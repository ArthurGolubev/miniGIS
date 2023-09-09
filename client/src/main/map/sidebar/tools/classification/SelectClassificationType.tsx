import * as React from 'react'
import { useNavigate } from 'react-router'


export const SelectClassificationType = () => {
    const redirect = useNavigate()

    return <div className="row justify-content-center">
        <div className='col-11'>
            <p>Тип классификации</p>
            <div className='row justify-content-center'>
                <div className='col-4'>
                    <button 
                    onClick={()=>redirect('unsupervised')}
                    className='btn btn-sm btn-light text-dark'
                    type='button'>Неконтролируемая</button>
                </div>
                <div className='col-4'>
                <button 
                    onClick={()=>redirect('supervised')}
                    className='btn btn-sm btn-light text-dark'
                    // disabled
                    type='button'>Контролируемая</button>
                </div>
            </div>
        </div>
    </div>
}