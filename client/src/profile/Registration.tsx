import { useMutation } from '@apollo/client'
import * as React from 'react'
import { REGISTRATION, TEST_REST_API, TEST_REST_API_2, TEST_REST_API_3 } from './mutations'



export const Registration = () => {
    const [registration] = useMutation(REGISTRATION, {fetchPolicy: 'network-only'})
    const [someTest] = useMutation(TEST_REST_API, {
        fetchPolicy: 'network-only',
        onCompleted: data => console.log('someTestData ->', data)
    })
    
    const [someTest2] = useMutation(TEST_REST_API_2, {
        fetchPolicy: 'network-only',
    })

    const [someTest3] = useMutation(TEST_REST_API_3, {
        fetchPolicy: "network-only"
    })

    const registrationHandler = () => {
        let login = (document.querySelector('#input-login') as HTMLInputElement)
        let password = (document.querySelector('#input-password') as HTMLInputElement)
        registration({
            variables: {
                login: login.value,
                password: password.value
            },
            onCompleted: data => {
                localStorage.setItem("miniGISToken", data.registration)
                login.value = ''
                password.value = ''
            }
        })
    }

    return <div className='row justify-content-center' style={{height: '65vh'}}>
        <div className='col-auto d-flex align-items-center'>
            <div className='card'>
                <div className='card-body'>
                    <div className='card-title'>
                        Регистрация
                    </div>
                    <div className='card-text'>

                        <div className='row justify-content-center'>
                            <label htmlFor='input-login' className='col-5 col-form-label'>Login:</label>
                            <div className='col'>
                                <input type='text' id='input-login' className='form-control form-control-sm' />
                            </div>
                        </div>
                            
                        <div className='row justify-content-center'>
                            <label htmlFor='input-passowrd' className='col-5 col-form-label'>Password:</label>
                            <div className='col'>
                                <input type='password' id='input-password' className='form-control form-control-sm'/>
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <button onClick={()=>registrationHandler()} className='btn btn-sm btn-primary' type='button'>Зарегистрироваться</button>
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <button onClick={()=>someTest({variables: {q: '1000'}})} className='btn btn-sm btn-success' type='button'>someRead</button>
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <button onClick={()=>someTest2({variables: {id: '1000'}})} className='btn btn-sm btn-success' type='button'>someRead2</button>
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <button onClick={()=>someTest3({
                                    variables: {
                                        input: {awesome: '1000'}
                                    }
                                    })} className='btn btn-sm btn-success' type='button'>someRead3</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
}