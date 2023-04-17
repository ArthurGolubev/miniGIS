import * as React from 'react'
import { useReactiveVar } from '@apollo/client'
import { BlankMap } from '../resultOnMap/BlankMap'
import { socket } from '../../../../../../app/socket'
import { AvailableFiles } from '../../AvailableFiles'
import { ResultOnMap } from '../resultOnMap/ResultOnMap'
import { ClassificationResultsType } from '../../../../types/interfacesTypeScript'
import { classification, classificationResponse, isLoading, selectedFiles } from '../../../../rv'
import { useLocation } from 'react-router'


export const MeanShift = () => {
    const classificationSub = useReactiveVar(classification)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const isLoadingSub = useReactiveVar(isLoading)
    const location = useLocation()
    const classificationResponseSub = useReactiveVar(classificationResponse) as ClassificationResultsType
    

    
    const classifyHandler = () => {
        isLoading(true)
        socket.emit(
            "unsupervised/mean-shift",
            {
                filePath: selectedFilesSub.files[location.pathname][0],
                n_samples: classificationSub.classes
            }
        )
    }

    


    return <div className='row justify-content-center'>
        <div className='col-12'>
            {/* -------------------------------------------Header-Start------------------------------------------ */}
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h2>Mean Shift</h2>
                </div>
            </div>
            {/* -------------------------------------------Header-End-------------------------------------------- */}

            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className='row justify-content-center'>

                        {/* -------------------------------------------Map-Start------------------------------------------ */}
                        <div className='col-6'>
                            {
                                classificationResponseSub?.["unsupervised/mean-shift"] ?
                                <ResultOnMap data={classificationResponseSub["unsupervised/mean-shift"]} /> : 
                                <BlankMap /> 
                            }
                        </div>
                        {/* -------------------------------------------Map-End-------------------------------------------- */}


                        {/* -------------------------------------------KMean-Start------------------------------------------ */}
                        <div className='col-6'>
                            <AvailableFiles to='unsupervised'/>
                            <div className='row justify-content-start mb-2'>
                                <div className='col-4'>
                                    <div className='input-group'>
                                        <label className='input-group-text' htmlFor='classes'>n samples:</label>
                                        <input className="form-control" type="number" min={1} max={100000}
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