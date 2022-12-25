import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { layers } from '../../../rv'

export const GeometryTable = () => {
    const layersSub = useReactiveVar(layers)

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
                {Object.values(layersSub).map((geom: any, iter: number) => {
                    if(geom.type == 'shape'){
                    return <tr key={'geom-' + iter}>
                        <th>{iter + 1}</th>
                        <td>{geom.shape}</td>
                        <td>{geom.outer_vertex}</td>
                        <td>{geom.inner_vertex}</td>
                    </tr>
                    } else {
                        return null
                    }
                })}
            </tbody>
        </table>
    </div>
}