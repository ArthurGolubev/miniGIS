import * as React from 'react'
import { selectedFiles, tools } from '../../rv'
import { AVAILABLE_FILES } from '../../restQueries'
import { useQuery, useReactiveVar } from '@apollo/client'


export const AvailableFiles = () => {
    const toolsSub = useReactiveVar(tools)
    const [state, setState] = React.useState({} as any)
    const {data, loading} = useQuery(AVAILABLE_FILES, {
        variables: {to: toolsSub.show},
        onCompleted: data => {
            let c = {} as any
            data.availableFiles.items.map((item: any) => {
                let key: string = Object.keys(item)[1]
                if(key != "items"){
                    c[key] = item[key]
                }
            })
            setState(c)
        }
    })
    const selectedFilesSub = useReactiveVar(selectedFiles)


    console.log('SOME PERERESOVALOS! -> ', data)

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
                            state && !loading && Object.keys(state).map(key => {
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
                            state && !loading && selectedFilesSub?.satellite &&
                            Object.keys(state[selectedFilesSub.satellite]).map(key => {
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
                    state && !loading && selectedFilesSub?.product && selectedFilesSub?.satellite && 
                    Object.entries(state[selectedFilesSub.satellite][selectedFilesSub.product]).map((entry: Array<any>, iter: number) => {
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

        <div className='row justify-content-center'>
            <div className='col-auto'>
                <button onClick={()=>console.log('data ->', data)} className='btn btn-sm btn-success' type='button'>data</button>
            </div>
        </div>

    </div>
}