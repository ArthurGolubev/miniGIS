import * as React from 'react'
import { AvailableFiles } from '../../AvailableFiles'
import { useLocation } from 'react-router'
import { ResultOnMap } from '../resultOnMap/ResultOnMap'
import { BlankMap } from '../resultOnMap/BlankMap'
import { socket } from '../../../../../../app/socket'
import { classificationDescription } from '../../../../../../analysis/stores/constants'
import { useClassificationResponse } from '../../../../../../analysis/stores/classificationResponse'
import { useLoading } from '../../../../../../interface/stores/Loading'
import { useClassificationConfig } from '../../../../../../analysis/stores/classificationConfig'
import { useSelectedFiles } from '../../../../../../analysis/stores/selectedFiles'

export const GaussianMixture = () => {

    const files = useSelectedFiles(state => state.files)
    const responses = useClassificationResponse(state => state.responses)
    const location = useLocation()
    const isLoading = useLoading(state => state.isLoading)
    const setLoading = useLoading(state => state.setLoading)
    const classes = useClassificationConfig(state => state.classes)
    const setClasses = useClassificationConfig(state => state.setClasses)

    
    const classifyHandler = () => {
        setLoading(true)
        socket.emit(
            "unsupervised/gaussian-mixture",
            {
                filePath: files[location.pathname][0],
                n_components: classes
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

            {/* -------------------------------------------Description-Start------------------------------------------ */}
            <div className='row justify-content-center'>
                <div className='col-10'>
                    {classificationDescription.unsupervised.GaussianMixture}
                </div>
            </div>
            {/* -------------------------------------------Description-End-------------------------------------------- */}

            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className='row justify-content-center'>

                        {/* -------------------------------------------Map-Start------------------------------------------ */}
                        <div className='col-6'>
                            {
                                responses?.["unsupervised/gaussian-mixture"] ?
                                <ResultOnMap data={responses["unsupervised/gaussian-mixture"]} /> : 
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
                                            onChange={e => setClasses(parseInt(e.target.value)) }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='row justify-content-start mb-2'>
                                <div className='col-12 text-center'>
                                    <button onClick={()=>classifyHandler()} className='btn btn-sm btn-success' type='button' disabled={isLoading}>classify</button>
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