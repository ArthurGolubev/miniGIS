import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { AVAILABLE_FILES, SEND_GEOJSON } from '../../query'
import { mapData } from '../../rv'


export const AvailableFiles = () => {

    const mapDataSub = useReactiveVar(mapData)
    const [state, setState] = React.useState({satellite: '', product: '', filePath: ''})
    const {data, loading} = useQuery(AVAILABLE_FILES)
    const [sendToServer] = useLazyQuery(SEND_GEOJSON, {fetchPolicy: "network-only"})

    const send = () => {
        let key = parseInt(Object.keys(mapDataSub)[0])
        console.log(key)
        sendToServer({variables: {
            geojson: mapDataSub[key].geom,
            filePath: state.filePath
        }})
    }


    return <div className='col-11'>

        <div className='row justify-content-center'>
            <div className='col-12'>
                <div>Спутник</div>
                <div className="input-group mb-3">
                    <select className="form-select" id="satellite"
                        onChange={e => setState({satellite: e.target.value, product: '', filePath: ''})}>
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
                    <select className="form-select" id="satellite"
                        onChange={e => setState({...state, product: e.target.value})}>
                        <option>...</option>
                        {
                            data && !loading && state?.satellite && Object.keys(data.availableFiles[state.satellite]).map(key => {
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
                <div className="input-group mb-3">
                    <select className="form-select" id="satellite"
                        onChange={e => setState({...state, filePath: e.target.value})}
                        >
                        <option>...</option>
                        {
                            data && !loading && state?.product && state?.satellite && 
                            data.availableFiles[state.satellite][state.product].map((key: string) => {
                                console.log("key ->", key)
                                return <option key={key} value={key}>{key}</option>
                            })
                        }
                    </select>
                </div>
            </div>
        </div>

        <button onClick={()=>send()} className='btn btn-sm btn-success' type='button'>CLIP</button>
    </div>
}