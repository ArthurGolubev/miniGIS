import { useMutation, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { AVAILABLE_FILES } from '../../../../restQueries'
import { CLASSIFY_BISECTING_KMEAN } from '../../../../restMutations'
import { classification, isLoading, selectedFiles } from '../../../../rv'
import { AvailableFiles } from '../../AvailableFiles'
import { useLocation } from 'react-router'
import { ResultOnMap } from '../resultOnMap/ResultOnMap'


export const BisectingKMean = () => {
    const classificationSub = useReactiveVar(classification)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const [classify, {data, loading}] = useMutation(CLASSIFY_BISECTING_KMEAN, {fetchPolicy: 'network-only'})
    const location = useLocation()
    console.log('selectedFilesSub.files -> ', selectedFilesSub.files)
    
    let center = [35.88, -5.3525]
    
    const classifyHandler = () => {
        isLoading(true)
        classify({
            variables: {
                options: {
                    filePath: selectedFilesSub.files[location.pathname][0],
                    k: classificationSub.classes
                }
            },
            fetchPolicy: 'network-only',
            onCompleted: data => {
                console.log('some data! -> ', data)
                let lng: number = data.classifyBisectingKMean.coordinates[0][1]
                let lat: number = data.classifyBisectingKMean.coordinates[0][0] 
                center = [lng, lat]
                isLoading(false)
            },
            refetchQueries: [
                {query: AVAILABLE_FILES, variables: {to: 'clip'}},
                {query: AVAILABLE_FILES, variables: {to: 'stack'}},
                {query: AVAILABLE_FILES, variables: {to: 'unsupervised'}},
                {query: AVAILABLE_FILES, variables: {to: 'supervised'}},
            ]
        })
    }



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
                            <ResultOnMap data={data?.classifyBisectingKMean} loading={loading} center={center}/>
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
                                    <button onClick={()=>classifyHandler()} className='btn btn-sm btn-success' type='button' disabled={loading}>classify</button>
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