import { useMutation } from '@apollo/client'
import * as React from 'react'
import { REGISTRATION } from './restMutations'
import { useNavigate } from "react-router"
import isEmail from 'validator/lib/isEmail'
import isStrongPassword from 'validator/lib/isStrongPassword'


export const Registration = () => {
    const [registration] = useMutation(REGISTRATION, {fetchPolicy: 'network-only'})
    const [state, setState] = React.useState({validPassword: true, validEmal: true, validLogin: true})
    const redirect = useNavigate()

    const registrationHandler = () => {
        let login = (document.querySelector('#input-login') as HTMLInputElement)
        let email = (document.querySelector('#input-email') as HTMLInputElement)
        let password1 = (document.querySelector('#input-password-1') as HTMLInputElement)
        let password2 = (document.querySelector('#input-password-2') as HTMLInputElement)
        
        let validLogin = login.value.match(/^[A-Za-z1-9]+$/) != null
        let validPassword = (password1.value == password2.value) && password1.value != '' && password1.value.length > 6

        let validEmal = email.value.includes("@") && email.value.includes(".")
        if(validEmal){
            let emailName = email.value.split("@")[0]
            let emailDomen = email.value.split("@")[1]
            if(emailName == '' || emailName.length < 2) validEmal = false

            let domenBeforDot = emailDomen.split(".")[0]
            let domenAfterDot = emailDomen.split(".")[1]
            if(domenBeforDot == '' || domenBeforDot.length < 2) validEmal = false
            if(domenAfterDot == '' || domenAfterDot.length < 2 || domenAfterDot.match(/^[1-9]+$/)) validEmal = false
        }

        setState({ validPassword: validPassword, validEmal: validEmal, validLogin: validLogin })
        if(validEmal && validPassword && validLogin){
            registration({
                variables: {
                    newUser: {
                        username: login.value,
                        email: email.value,
                        password: password1.value
                    }
                },
                onCompleted: data => {
                    localStorage.setItem("miniGISToken", data.registration)
                    login.value = ''
                    email.value = ''
                    password1.value = ''
                    password2.value = ''
                    redirect("/authorization")
                }
            })
        }
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
                                <input type='text' id='input-login'
                                className={state.validLogin ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>

                        <div className='row justify-content-center'>
                            <label htmlFor='input-email' className='col-5 col-form-label'>Email:</label>
                            <div className='col'>
                                <input type='email' id='input-email'
                                className={state.validEmal ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>
                            
                        <div className='row justify-content-center'>
                            <label htmlFor='input-passowrd-1' className='col-5 col-form-label'>Password:</label>
                            <div className='col'>
                                <input type='password' id='input-password-1' 
                                className={state.validPassword ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>

                        <div className='row justify-content-center'>
                            <label htmlFor='input-passowrd-2' className='col-5 col-form-label'>Password:</label>
                            <div className='col'>
                                <input type='password' id='input-password-2'
                                className={state.validPassword ? 'form-control form-control-sm' : 'form-control form-control-sm is-invalid'}
                                />
                            </div>
                        </div>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <button onClick={()=>registrationHandler()} className='btn btn-sm btn-primary' type='button'>Зарегистрироваться</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
}