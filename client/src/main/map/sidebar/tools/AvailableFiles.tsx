import * as React from 'react'
import { useLocation } from 'react-router'
import { useSelectedFiles } from '../../../../analysis/stores/selectedFiles'
import { ax } from '../../../../axiosInstance'


export const AvailableFiles = ({to = undefined}: {to: string | undefined}) => {
    let location = useLocation()
    const scope = {
        'clip': 'raw',
        'stack': 'clipped',
        'unsupervised': 'stack'
    } as any
    const [state, setState] = React.useState({} as any)

    ax.get(`/workflow/available-files/${to}`).then(response => {
        let tree = {} as any
            let satellites = response.data.items[0].satellites
            console.log('af satellites -> ', satellites)
            Object.keys(satellites).map(sattelite => {
                tree[sattelite] = {}
                Object.keys(satellites[sattelite]).map(product => {
                    tree[sattelite][product] = {}
                    Object.keys(satellites[sattelite][product]).map(result => {
                        tree[sattelite][product][result] = satellites[sattelite][product][result]
                    })
                })
            })
            setState(tree)
            console.log('tree -> ', tree)
    })
    
    const setSatellite = useSelectedFiles(state => state.setSatellite)
    const setFiles = useSelectedFiles(state => state.setFiles)
    const setProduct = useSelectedFiles(state => state.setProduct)
    const files = useSelectedFiles(state => state.files)
    const satellite = useSelectedFiles(state => state.satellite)
    const product = useSelectedFiles(state => state.product)



    return <div className='col-11'>

        <div className='row justify-content-center'>
            <div className='col-12'>
                <div>Спутник</div>
                <div className="input-group mb-3">
                <select className="form-select" id="satellite"
                            onChange={e => {
                                setSatellite(e.target.value)
                                setFiles({...files, [location.pathname]: [] })
                            }}
                            >
                            <option>...</option>
                            {
                                state && Object.keys(state).map(key => {
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
                            onChange={e => setProduct(e.target.value)}>
                            <option>...</option>
                            {
                                state && satellite &&
                                Object.keys(state[satellite]).map(key => {
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
                        state && product && satellite &&
                        Object.entries(state[satellite][product][scope[to]]).map((entry: Array<any>, iter: number) => {
                            console.log("key ->", entry[0])
                            // return <div className={location.pathname == "/main/classification" ? 'col-12' : 'col-4'} key={iter}>
                            return <div className='col-12' key={iter}>
                                <div className="form-check form-check-inline">
                                    <input className='form-check-input' type={"checkbox"} id={`band-${entry[0]}`} defaultChecked={false} value={entry[1]}
                                        onChange={e => setFiles({
                                                ...files,
                                                [location.pathname]: [...files[location.pathname], e.target.value]
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