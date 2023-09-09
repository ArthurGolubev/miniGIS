import * as React from 'react'
import { useNavigate } from 'react-router'
import { ax } from '../index'


export const Authorization = () => {
    const redirect = useNavigate()
    const [state, setState] = React.useState({ validPassword: true, validLogin: true })
    const [token, setToken] = React.useState(undefined)

    interface AuthorizationType {
        accessToken: string
        tokenType: string
    }

    interface GetMeType {
        id: string
        email: string
        username: string
        yandexToken: string
    }

    // Попробовать так
    React.useEffect(() => {
        if(!token?.accessToken){
            ax.get<GetMeType>("/user/get-me").then(response => {
                if(response.data.yandexToken == "False"){
                        redirect("/yandex-authorization")
                    } else {
                        localStorage.setItem('usr', response.data.username)
                        redirect('/main/map/workflow/poi')
                    }
            })
        }
    })

    
    const authorizationHandler = async () => {
        let username = (document.querySelector('#input-login') as HTMLInputElement)
        let password = (document.querySelector('#input-password') as HTMLInputElement)
        let response = await ax.post<AuthorizationType>("/user/get-token-from-client", {
            user: {
                username: username.value,
                password: password.value
            }
        })
        localStorage.setItem('miniGISToken', response.data.accessToken)
        setToken(response)
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

