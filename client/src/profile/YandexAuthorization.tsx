import { useQuery } from '@apollo/client'
import * as React from 'react'
import { GET_YANDEX_DISK_AUTH_URL, GET_YANDEX_DISK_TOKEN } from './restMutations'
import { useNavigate, useSearchParams } from "react-router-dom"


export const YandexAuthorization = () => {
    const redirect = useNavigate()
    let [searchParams, setSearchParams] = useSearchParams()
    const {data, loading} = useQuery(GET_YANDEX_DISK_AUTH_URL)
    const {data: data2} = useQuery(GET_YANDEX_DISK_TOKEN, {
        skip: searchParams.toString() == '',
        variables: {
            code: searchParams.values().next().value ?? 123
        },
        onCompleted: () => {
            redirect("/main")
        }
    })
    
    

    if(!data || loading) return null

    return <div className='row justify-content-center' style={{height: '65vh'}}>
        <div className='col-auto d-flex align-items-center'>
            <div className='card'>
                <div className='card-body'>
                    <div className='card-title'>
                        Авторизация на Yandex Disk
                    </div>
                    <div className='card-text'>

                        <div className='row justify-content-center mt-3'>
                            <div className='col-auto'>
                                <a
                                href={data.getYandexDiskAuthUrl.url}
                                className='btn btn-sm btn-primary'
                                type='button'>Авторизироваться</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
}