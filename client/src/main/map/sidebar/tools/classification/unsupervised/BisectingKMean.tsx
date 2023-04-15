import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { AVAILABLE_FILES } from '../../../../restQueries'
import { classification, isLoading, selectedFiles, toasts, websocketMessages, ws } from '../../../../rv'
import { AvailableFiles } from '../../AvailableFiles'
import { useLocation } from 'react-router'
import { ResultOnMap } from '../resultOnMap/ResultOnMap'
import { BlankMap } from '../resultOnMap/BlankMap'


export const BisectingKMean = () => {
    const classificationSub = useReactiveVar(classification)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const location = useLocation()
    const wsSub = useReactiveVar(ws) as any
    const websocketMessagesSub = useReactiveVar(websocketMessages)
    const [state, setState] = React.useState()
    const isLoadingSub = useReactiveVar(isLoading)
    


    React.useEffect(() => {
        if(!wsSub) return
        wsSub.onmessage = (e: any) => {
            const message = JSON.parse(e.data)
            console.log('message -> ', message)
            websocketMessages([...websocketMessagesSub, message])
            if(message.operation == '/classification/unsupervised/bisecting-kmean'){
                isLoading(false)
                toasts({[new Date().toLocaleString()]: {
                    header: message.header,
                    message: message.message,
                    show: true,
                    datetime: new Date(message.datetime),
                    color: 'text-bg-success'
                }})
                setState(message)
            call1()
            call2()
            call3()
            }
        }
    })



    const classifyHandler = () => {
        isLoading(true)
        wsSub.send(JSON.stringify({
            operation: '/classification/unsupervised/bisecting-kmean',
            token: `Bearer ${localStorage.getItem("miniGISToken")}`,
            filePath: selectedFilesSub.files[location.pathname][0],
            k: classificationSub.classes
        }))
    }


    const [call1] = useLazyQuery(AVAILABLE_FILES, {variables: {to: 'clip'}})
    const [call2] = useLazyQuery(AVAILABLE_FILES, {variables: {to: 'stack'}})
    const [call3] = useLazyQuery(AVAILABLE_FILES, {variables: {to: 'classification'}})


    return <div className='row justify-content-center'>
        <div className='col-12'>
            {/* -------------------------------------------Header-Start------------------------------------------ */}
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h2>Bisecting KMean</h2>
                </div>
            </div>
            {/* -------------------------------------------Header-End-------------------------------------------- */}

            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className='row justify-content-center'>

                        {/* -------------------------------------------Map-Start------------------------------------------ */}
                        <div className='col-6'>
                            { state !== undefined ? <ResultOnMap data={state} /> : <BlankMap /> }
                        </div>
                        {/* -------------------------------------------Map-End-------------------------------------------- */}


                        {/* -------------------------------------------KMean-Start------------------------------------------ */}
                        <div className='col-6'>
                            <AvailableFiles to='unsupervised'/>
                            <div className='row justify-content-start mb-2'>
                                <div className='col-4'>
                                    <div className='input-group'>
                                        <label className='input-group-text' htmlFor='classes'>k:</label>
                                        <input className="form-control" type="number" min={1} max={30}
                                            onChange={e => classification({...classificationSub, classes: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row justify-content-start mb-2'>
                                <div className='col-12 text-center'>
                                    <button onClick={()=>classifyHandler()} className='btn btn-sm btn-success' type='button' disabled={isLoadingSub}>classify</button>
                                </div>
                            </div>
                        </div>
                        {/* -------------------------------------------KMean-End-------------------------------------------- */}

                    </div>
                </div>
            </div>

        </div>
    </div>

}