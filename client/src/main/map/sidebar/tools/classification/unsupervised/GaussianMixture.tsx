import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { classification, classificationResponse, isLoading, selectedFiles, } from '../../../../rv'
import { AvailableFiles } from '../../AvailableFiles'
import { useLocation } from 'react-router'
import { ResultOnMap } from '../resultOnMap/ResultOnMap'
import { BlankMap } from '../resultOnMap/BlankMap'
import { socket } from '../../../../../../app/socket'
import { ClassificationResultsType } from '../../../../types/interfacesTypeScript'


export const GaussianMixture = () => {
    const classificationSub = useReactiveVar(classification)
    const selectedFilesSub = useReactiveVar(selectedFiles)
    const location = useLocation()
    const isLoadingSub = useReactiveVar(isLoading) 
    const classificationResponseSub = useReactiveVar(classificationResponse) as ClassificationResultsType

    
    const classifyHandler = () => {
        isLoading(true)
        socket.emit(
            "unsupervised/gaussian-mixture",
            {
                filePath: selectedFilesSub.files[location.pathname][0],
                n_components: classificationSub.classes
            }
        )
    }


    return <div className='row justify-content-center'>
        <div className='col-12'>
            {/* -------------------------------------------Header-Start------------------------------------------ */}
            <div className='row justify-content-center'>
                <div className='col-10'>
                    <h2>Gaussian Mixture</h2>
                </div>
            </div>
            {/* -------------------------------------------Header-End-------------------------------------------- */}

            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className='row justify-content-center'>

                        {/* -------------------------------------------Map-Start------------------------------------------ */}
                        <div className='col-6'>
                            {
                                classificationResponseSub?.["unsupervised/gaussian-mixture"] ?
                                <ResultOnMap data={classificationResponseSub["unsupervised/gaussian-mixture"]} /> : 
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
                                        <label className='input-group-text' htmlFor='classes'>n components:</label>
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