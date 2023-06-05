import * as React from 'react'
import { isProgress } from '../../main/map/rv'
import { useReactiveVar } from '@apollo/client'
import { useTimelineStore } from '../../timeline/store'



export const ProgressBarStatus = () => {
    const isProgressSub = useTimelineStore().isProgressBar


    let width = (isProgressSub.iter / isProgressSub.iters) * 100
    return <div className='row justify-content-center'>
        <div className='col-12'>
            <div className="progress">
                <div
                className="progress-bar bg-success progress-bar-striped progress-bar-animated"
                role="progressbar"
                aria-label="Default striped example"
                style={{width: `${width}%`}}
                aria-valuenow={isProgressSub.iter}
                aria-valuemin={0}
                aria-valuemax={isProgressSub.iters}>
                    {isProgressSub.iter} / {isProgressSub.iters}
                </div>
            </div>
        </div>
    </div>
}