import * as React from 'react'
import { Map2 } from './Map2'

import { StepsNav } from './StepsNav'
import { Outlet, useNavigate } from 'react-router'




export const Automation = () => {

    return <div>

        <div className='row justify-content-center mt-4'>
            <div className='col-11'>
                <h2 className='text-center'>Создание алгоритма обработки</h2>
                
                <div className='row justify-content-start mt-3'>
                    <div className='col-6'>
                        <Map2 mapId='map-2'/>
                    </div>
                    <div className='col-6'>
                        <div className='row justify-content-center'>
                            <div className='col-12'>
                                <StepsNav />
                            </div>
                        </div>


                        <div className='row justify-content-center'>
                            <div className='col-12'>
                                <Outlet />
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </div>
}