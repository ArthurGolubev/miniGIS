import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { mapData } from './rv'


export const Sidebar = () => {
    const mapDataSub = useReactiveVar(mapData)

    

    return <div className='card' style={{height: "100%"}}>
        <div className='row justify-content-center'>
            <div className='col-12 m-2'>
                <h5 className='text-center'>Выбор места</h5>
            </div>
        </div>
        <div className='row justify-content-center'>
            <div className='col-12'>
                <button onClick={()=>console.log(mapDataSub)} className='btn btn-sm btn-success' type='button'>mapData</button>
            </div>
        </div>
        <div className='row justify-content-center'>
            <div className='col-12'>
                <h5>Выбор спутникового снимка</h5>
            </div>
        </div>
        <div className='row justify-content-center'>
            <div className='col-12'>
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Тип</th>
                                <th scope="col">Вершин</th>
                                <th scope="col">Вырез</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(mapDataSub).map((geom: any, iter: number) => {
                                return <tr key={'geom-' + iter}>
                                    <th>{iter + 1}</th>
                                    <td>{geom.shape}</td>
                                    <td>{geom.outer_vertex}</td>
                                    <td>{geom.inner_vertex}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
}