import * as React from "react"
import { useOutletContext } from "react-router-dom"



export const ClassificationReport = () => {
    const [img] = useOutletContext<any>()

    return <div className='row justify-content-start'>
        <div className='col-12 table-responsive' style={{height: '55vh'}}>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">precision</th>
                        <th scope="col">recall</th>
                        <th scope="col">f1-score</th>
                        <th scope="col">support</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(img.statistic.classification_report).map(key => {
                        return <tr key={key}>
                            <th scope="row">{key}</th>
                            {
                                Object.values(img.statistic.classification_report[key]).map((val: number, iter) => {
                                    return <td key={iter}>{val}</td>
                                })
                            }
                        </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>

}