import * as React from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQuery } from '@apollo/client'
import { AUTHORIZATION, GET_ME } from './restMutations'
import { useProfileStore } from './store'



export const Authorization = () => {
    const redirect = useNavigate()
    const [state, setState] = React.useState({ validPassword: true, validLogin: true })
    const [login, {data: token}] = useMutation(AUTHORIZATION, {fetchPolicy: 'network-only'})
    const {data} = useQuery(GET_ME, {
        skip: !token?.loginForAccessTokenFromClient?.accessToken,
        fetchPolicy: "network-only",
        onCompleted: user => {
            if(user.getMe.yandexToken == "False"){
                redirect("/yandex-authorization")
            } else {
                localStorage.setItem('usr', user.getMe.username)
                redirect('/main/map/workflow/poi')
            }
        }
    })

    
    const authorizationHandler = () => {
        let username = (document.querySelector('#input-login') as HTMLInputElement)
        let password = (document.querySelector('#input-password') as HTMLInputElement)
        login({
            variables: {
                user: {
                    username: username.value,
                    password: password.value
                }
            },
            onCompleted: data => {
                localStorage.setItem('miniGISToken', data.loginForAccessTokenFromClient.accessToken)
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
                            <label htmlFor='input-login' className='col-5 col-form-label'>Логин:</label>
                            <div className='col'>
                                <input type='text' id='input-login'
                                className={state.validLogin ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>

                        <div className='row justify-content-center'>
                            <label htmlFor='input-login' className='col-5 col-form-label'>Пароль:</label>
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

