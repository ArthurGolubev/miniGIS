import * as React from "react"


export const Stats = ({band}: {band: any}) => {
    
    return <div className='row justify-content-center mt-3'>
        <div className='col-12'>
            <div className='row justify-content-between'>
                <div className='col-auto'>max <b>{band.max}</b></div>
                <div className='col-auto'>min <b>{band.min}</b></div>
                <div className='col-auto'>mean <b>{band.mean}</b></div>
                <div className='col-auto'>median <b>{band.median}</b></div>
            </div>
        </div>
    </div>
}