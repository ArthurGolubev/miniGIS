import * as React from 'react'
import { useOutletContext } from "react-router-dom"


export const StatisticTable1 = () => {
    const [img] = useOutletContext<any>()


    return <div className='row justify-content-start'>
        <div className='col-auto table-responsive'>
            <table className='table'>
                <tbody>
                    <tr>
                        <th scope='row'>AMI</th>
                        <td>{img.statistic.AMI}</td>
                    </tr>
                    <tr>
                        <th scope='row'>ARI</th>
                        <td>{img.statistic.ARI}</td>
                    </tr>
                    <tr>
                        <th scope='row'>compl</th>
                        <td>{img.statistic.compl}</td>
                    </tr>
                    <tr>
                        <th scope='row'>homo</th>
                        <td>{img.statistic.homo}</td>
                    </tr>
                    <tr>
                        <th scope='row'>v-meas</th>
                        <td>{img.statistic['v-meas']}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

}