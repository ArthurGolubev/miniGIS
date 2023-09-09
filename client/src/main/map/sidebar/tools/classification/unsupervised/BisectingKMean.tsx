import * as React from 'react'
import { useLocation } from 'react-router'
import { BlankMap } from '../resultOnMap/BlankMap'
import { socket } from '../../../../../../app/socket'
import { AvailableFiles } from '../../AvailableFiles'
import { ResultOnMap } from '../resultOnMap/ResultOnMap'
import { classificationDescription } from '../../../../../../analysis/stores/constants'
import { useClassificationResponse } from '../../../../../../analysis/stores/classificationResponse'
import { useLoading } from '../../../../../../interface/stores/Loading'
import { useClassificationConfig } from '../../../../../../analysis/stores/classificationConfig'
import { useSelectedFiles } from '../../../../../../analysis/stores/selectedFiles'


export const BisectingKMean = () => {
    const files = useSelectedFiles(state => state.files)
    const responses = useClassificationResponse(state => state.responses)
    const location = useLocation()
    const isLoading = useLoading(state => state.isLoading)
    const setLoading = useLoading(state => state.setLoading)
    const classes = useClassificationConfig(state => state.classes)
    const setClasses = useClassificationConfig(state => state.setClasses)


    const classifyHandler = () => {
        console.log('Bisecting Kmean start!')
        setLoading(true)
        socket.emit(
            "unsupervised/bisecting-kmean",
            {
                filePath: files[location.pathname][0],
                k: classes
            }
        )
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


            {/* -------------------------------------------Description-Start------------------------------------------ */}
            <div className='row justify-content-center mt-2'>
                <div className='col-10'>
                    {classificationDescription.unsupervised.BisectingKMean}
                </div>
            </div>
            {/* -------------------------------------------Description-End-------------------------------------------- */}


            <div className='row justify-content-center'>
                <div className='col-10'>
                    <div className='row justify-content-center'>

                        {/* -------------------------------------------Map-Start------------------------------------------ */}
                        <div className='col-6'>
                            { 
                                responses?.["unsupervised/bisecting-kmean"] ?
                                <ResultOnMap data={responses["unsupervised/bisecting-kmean"]} /> :
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
                                        <label className='input-group-text' htmlFor='classes'>k:</label>
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