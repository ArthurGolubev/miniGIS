import * as React from 'react'
import { useNavigate, useSearchParams } from "react-router-dom"
import { ax } from '../axiosInstance'


export const YandexAuthorization = () => {
    const redirect = useNavigate()
    const [state, setState] = React.useState(undefined)
    let [searchParams, setSearchParams] = useSearchParams()
    
    const yandexDiskAuthUrl = 
    React.useEffect(() => {
        ax.get('/user/get-yandex-disk-auth-url').then(response => setState(response))
    }, [])
    // Попробовать так
    React.useEffect(() => {
        if(searchParams.toString() !== ''){
            ax.get("/user/get-yandex-disk-token/{args.code}").then(() => redirect("/main"))
        }
    })
    
    // const {data: data2} = useQuery(GET_YANDEX_DISK_TOKEN, {
    //     skip: searchParams.toString() == '',
    //     variables: {
    //         code: searchParams.values().next().value ?? 123
    //     },
    //     onCompleted: () => {
    //         redirect("/main")
    //     }
    // })
    
    

    if(state == undefined) return null

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
                                href={state.url}
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