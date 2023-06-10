import * as React from "react"


export const Stats = ({band}: {band: any}) => {
    
    return <div className='row justify-content-center mt-3'>
        <div className='col-12'>
            <ul>
                <li>Band name {band.band}</li>
                <li>max {band.max}</li>
                <li>min {band.min}</li>
                <li>mean {band.mean}</li>
                <li>median {band.median}</li>
            </ul>
        </div>
    </div>
}