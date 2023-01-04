import { useQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { AVAILABLE_FILES } from '../../queries'
import { selectedFiles, tools } from '../../rv'


export const AvailableFiles = () => {
    const toolsSub = useReactiveVar(tools)
    const {data, loading} = useQuery(AVAILABLE_FILES, {variables: {to: toolsSub.show}})
    const selectedFilesSub = useReactiveVar(selectedFiles)

    return <div className='col-11'>

        <div className='row justify-content-center'>
            <div className='col-12'>
                <div>Спутник</div>
                <div className="input-group mb-3">
                    <select className="form-select" id="satellite"
                        onChange={e => selectedFiles({satellite: e.target.value, product: '', files: {
                            ...selectedFilesSub.files,
                            [toolsSub.show]: []
                        }})}>
                        <option>...</option>
                        {
                            data && !loading && Object.keys(data.availableFiles).map(key => {
                                return <option key={key} value={key}>{key}</option>
                            })
                        }
                    </select>
                </div>
            </div>
        </div>

        <div className='row justify-content-center'>
            <div className='col-12'>
                <div>Продукт</div>
                <div className="input-group mb-3">
                    <select className="form-select" id="product"
                        onChange={e => selectedFiles({...selectedFilesSub, product: e.target.value})}>
                        <option>...</option>
                        {
                            data && !loading && selectedFilesSub?.satellite &&
                            Object.keys(data.availableFiles[selectedFilesSub.satellite]).map(key => {
                                return <option key={key} value={key}>{key}</option>
                            })
                        }
                    </select>
                </div>
            </div>
        </div>

        <div className='row justify-content-center'>
            <div className='col-12'>
                <div>Слои</div>
                {
                    data && !loading && selectedFilesSub?.product && selectedFilesSub?.satellite && 
                    Object.entries(data.availableFiles[selectedFilesSub.satellite][selectedFilesSub.product]).map((entry: Array<any>, iter: number) => {
                        console.log("key ->", entry[0])
                        return <div className={toolsSub.show == "Classification" ? 'col-12' : 'col-4'} key={iter}>
                            <div className="form-check form-check-inline">
                                <input className='form-check-input' type={"checkbox"} id={`band-${entry[0]}`} defaultChecked={false} value={entry[1]}
                                    onChange={e => selectedFiles({
                                        ...selectedFilesSub,
                                        files: {
                                            ...selectedFilesSub.files,
                                            [toolsSub.show]: [...selectedFilesSub.files[toolsSub.show], e.target.value]
                                        }
                                        })}
                                />
                                <label className='form-check-label text-break' htmlFor={"band-" + entry[0]}>{entry[0]}</label>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>

    </div>
}