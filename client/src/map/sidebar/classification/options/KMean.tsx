import { useLazyQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { CLASSIFY_K_MEAN } from '../../../query'
import { classification, isLoading, selectedFiles } from '../../../rv'


export const KMean = () => {
    const classificationSub = useReactiveVar(classification)
    const selectedFilesSub = useReactiveVar(selectedFiles)

    const [classify] = useLazyQuery(CLASSIFY_K_MEAN)

    const classifyHandler = () => {
        isLoading(true)
        classify({
            variables: {filePath: selectedFilesSub.files.Classification[0], k: classificationSub.classes},
            fetchPolicy: 'network-only',
            onCompleted: () => isLoading(false)
        })
    }


    return <div className='row justify-content-start mb-2'>
        <div className='col-12'>
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
                <div className='col-4'>
                    <button onClick={()=>classifyHandler()} className='btn btn-sm btn-success' type='button'>classify</button>
                </div>
            </div>

        </div>
    </div>
}