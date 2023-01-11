import { useMutation } from '@apollo/client'
import * as React from 'react'
import { useNavigate } from 'react-router'
import { AUTHORIZATION } from './restMutations'



export const Authorization = () => {
    const [state, setState] = React.useState({ validPassword: true, validLogin: true })
    const [login] = useMutation(AUTHORIZATION)
    const redirect = useNavigate()

    
    const authorizationHandler = () => {
        let username = (document.querySelector('#input-login') as HTMLInputElement)
        let password = (document.querySelector('#input-password') as HTMLInputElement)
        console.log('%cusername.value -> ', 'color: green; background: yellow; font-size: 30px', username.value)
        console.log('%cpassword.value -> ', 'color: green; background: yellow; font-size: 30px', password.value)
        login({
            variables: {
                user: {
                    username: username.value,
                    password: password.value
                }
            },
            onCompleted: data => {
                localStorage.setItem('miniGISToken', data.loginForAccessTokenFromClient.accessToken)
                redirect('/main')
            }
        })
    }

    return <div className='row justify-content-center' style={{height: '65vh'}}>
        <div className='col-auto d-flex align-items-center'>
            <div className='card'>
                <div className='card-body'>
                    <div className='card-title'>
                        Авторизация
                    </div>
                    <div className='card-text'>

                        <div className='row justify-content-center'>
                            <label htmlFor='input-login' className='col-5 col-form-label'>Login:</label>
                            <div className='col'>
                                <input type='text' id='input-login'
                                className={state.validLogin ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>

                        <div className='row justify-content-center'>
                            <label htmlFor='input-login' className='col-5 col-form-label'>Password:</label>
                            <div className='col'>
                                <input type='password' id='input-password'
                                className={state.validLogin ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <button onClick={()=>authorizationHandler()} className='btn btn-sm btn-primary' type='button'>Авторизироваться</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
}

