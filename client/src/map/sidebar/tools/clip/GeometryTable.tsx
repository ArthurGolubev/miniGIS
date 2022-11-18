import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { mapData } from '../../../rv'

export const GeometryTable = () => {
    const mapDataSub = useReactiveVar(mapData)

    return <div className='table-responsive'>
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
}