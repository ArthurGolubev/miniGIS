import * as React from 'react'
import { useLazyQuery, useReactiveVar } from '@apollo/client'
import { isLoading, layers, mapLayerControl, mapObj, selectedVecLay, showToggle } from '../../../../rv'
import { VectorInterface } from '../../../../types/main/LayerTypes'
import { SHP_SAVE } from '../../../../restQueries'



export const DetailVec = () => {
    const isLoadingSub = useReactiveVar(isLoading)
    const layersSub = useReactiveVar(layers)
    const selectedVecLaySub = useReactiveVar(selectedVecLay)
    const mapObjSub = useReactiveVar(mapObj)
    const showToggleSub = useReactiveVar(showToggle)
    const mapLayerControlSub = useReactiveVar(mapLayerControl) as any
    const [state, setState] = React.useState({attr: false, shape: false, editPropShapeID: undefined})
    const [shpWrite] = useLazyQuery(SHP_SAVE, {fetchPolicy: 'network-only'})
    
    type InputTypes = "C" | "N" | "F" | "L" | "D"
    const inputTypes = {
        "C": 'text',
        "N": 'number',
        "F": 'number',
        "L": 'checkbox',
        "D": 'date'
    }


    const addShapeHandler = (type: 'Points' | 'Polylines' | 'Polygones') => {
        let shape = {
            'Points': 'Marker',
            'Polylines': 'Line',
            'Polygones': 'Polygon'
        }
        mapObjSub.pm.enableDraw(shape[type], {
            continueDrawing: true,
        })
        setState({...state, shape: true})
    }

    const saveLayerHandler = (key: string) => {
        let layer = layersSub[selectedVecLaySub] as VectorInterface
        mapLayerControlSub.addOverlay(layer.layer, key)
        layer.layer.setStyle({color: layer.color})
        mapObjSub.pm.disableDraw()
        setState({...state, shape: false})
    }

    const addAttrToLayerHandler = () => {
        let attrName = (document.querySelector("#attr-name") as HTMLInputElement).value
        let attrType = (document.querySelector("#attr-type") as HTMLInputElement).value

        console.log('attrName -> ', attrName)
        console.log('attrType -> ', attrType)
        layers({
            ...layersSub,
            [selectedVecLaySub]: {
                ...layersSub[selectedVecLaySub],
                properties: {
                    ...(layersSub[selectedVecLaySub] as VectorInterface)?.properties,
                    [`${attrName}_${attrType}`]: {
                        fieldType: attrType,
                    }
                }
            } as VectorInterface
        })
        Object.keys( layersSub[selectedVecLaySub].layer._layers).map((key: string) => layersSub[selectedVecLaySub].layer._layers[key].feature.properties[`${attrName}_${attrType}`] = attrType == 'L' ? false : '' )
        setState({...state, attr: false})
    }

    const saveShapeAttr = (propName: string, value: string | boolean) => {
        console.log('value -> ', value)
        // layersSub[selectedVecLaySub].layer._layers[state.editPropShapeID].feature.properties[propName] = `${value}`
        layersSub[selectedVecLaySub].layer._layers[state.editPropShapeID].feature.properties[propName] = value
        layers({...layersSub }) // ?????? ????????-???????? ???????????????????? ?????????????? ??????????????????
        // ???????? ???????????? ?????????????????? ?????????? ???????????????????? ????????????????????, ?? ???? properties[propName] = `${value}` , ???? ????????????
        // ???????????????????? ?????????????? ...layer ???????????? ???????????????????? ???????????????????? - ???????????? ?????? ?????? ???????????????? ?????????????????????? ?? ?????????????????????? ???????????????????? ??????????????...
        // (???? ????????????????????!)
    }

    const backToLayerList = () => {
        selectedVecLay(''),
        showToggle({
            ...showToggleSub,
            DetailVec: false,
            LayerList: true
        })
    }

    const saveToShp = () => {

        console.log('layersSub -> ', layersSub)
        console.log('GEO-JSON -> ', layersSub[selectedVecLaySub].layer.toGeoJSON())
        isLoading(true)
        shpWrite({
            variables: {
                input: {
                    shpName: selectedVecLaySub,
                    layer: JSON.stringify(layersSub[selectedVecLaySub].layer.toGeoJSON())
                }
            },
            onCompleted: () => isLoading(false)
        })
    }
    
    return <div>


        {/* -------------------------------------------Header-Start------------------------------------------ */}
        <div className='row justify-content-center'>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <figure>
                    <blockquote className="blockquote">
                        <div className='row justify-content-center'>
                            <div className='col'>
                                {selectedVecLaySub}
                            </div>
                            <div className='col-auto me-3'>
                                <button 
                                onClick={()=>backToLayerList()}
                                className='btn btn-sm btn-light' type='button'>
                                    <i className="bi bi-arrow-left link-primary"></i> back
                                </button>
                            </div>
                        </div>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        <strong>?????? ????????: </strong>{(layersSub[selectedVecLaySub] as VectorInterface).type}.
                        <span> </span>
                        <strong>???????????????????? ??????????: </strong>{Object.keys(layersSub[selectedVecLaySub].layer._layers).length}
                    </figcaption>
                </figure>
            </div>
        </div>
        {/* -------------------------------------------Header-End-------------------------------------------- */}


        {/* -------------------------------------------Control-Start------------------------------------------ */}
        <div className='row justify-content-center mb-3 mt-2'>
            <div className='col-11'>

                <div className='row justify-content-between'>
                    <div className='col'>
                        <div className="btn-group btn-group-sm input-group-sm">
                            <span className='input-group-text'>????????????</span>
                            <button
                            disabled={state.shape}
                            onClick={()=>addShapeHandler((layersSub[selectedVecLaySub] as VectorInterface).type)}
                            className={!state.shape ? 'btn btn-sm btn-light' : 'btn btn-sm btn-success'}
                            type='button'>
                                <i className="bi bi-plus-lg"></i>
                            </button>
                            <button 
                            disabled={!state.shape}
                            onClick={()=>saveLayerHandler(selectedVecLaySub)}
                            className={!state.shape ? 'btn btn-sm btn-light' : 'btn btn-sm btn-success'}
                            type='button'>
                                <i className="bi bi-check-lg"></i>
                            </button>
                        </div>
                        
                    </div>
                    <div className='col'>
                        <div className='btn-group btn-group-sm input-group-sm'>
                            <span className='input-group-text'>????????????????</span>
                            <button
                            onClick={()=>setState({...state, attr:true})}
                            className={!state.attr ? 'btn btn-sm btn-light' : 'btn btn-sm btn-success'}
                            type='button' disabled={state.attr}>
                                <i className="bi bi-plus-lg"></i>
                            </button>
                            <button 
                            disabled={!state.attr}
                            onClick={()=>addAttrToLayerHandler()}
                            className={!state.attr ? 'btn btn-sm btn-light' : 'btn btn-sm btn-success'}
                            type='button'>
                                <i className="bi bi-check-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        {/* -------------------------------------------Control-End-------------------------------------------- */}


        {/* -------------------------------------------LayerProperties-Start------------------------------------------ */}
        {
            state.attr &&
            <div className='row justify-content-center mt-2 mb-2'>
                <div className='col-11'>
                    <div className='alert alert-light'>
                        
                    <div className='row justify-content-center'>
                        <div className='col-12'>
                            {
                                (layersSub[selectedVecLaySub] as VectorInterface).type != 'Points' && <div>
                                    <p>???????? ????????????</p>
                                    <input
                                        type="color"
                                        value={(layersSub[selectedVecLaySub] as VectorInterface).color}
                                        onChange={e => (layersSub[selectedVecLaySub] as VectorInterface).layer.setStyle({color: e.target.value})}
                                    />
                                </div>
                            }
                        </div>
                    </div>

                    <div className='row justify-content-center'>
                        <div className='col-12'>
                            <strong>???????????????? ????????</strong>
                            <div className='input-group input-group-sm'>
                                <div className='input-group-text'>????????????????</div>
                                <input type='text' className="form-control" id="attr-name"/>
                                <div className='input-group-text'>??????</div>
                                <select className='form-select' id="attr-type">
                                    <option value="C">??????????</option>
                                    <option value="N">??????????</option>
                                    <option value="F">?????????? ?? ??????????????</option>
                                    <option value="L">????????????????????</option>
                                    <option value="D">????????</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    </div>
                </div>
            </div>
        }

        {/* -------------------------------------------LayerProperties-End-------------------------------------------- */}


        {/* -------------------------------------------Edit-Shape-Properties-Start------------------------------------------ */}
        {
            state.editPropShapeID != undefined &&
            <div className='row justify-content-center'>
                <div className='col-11'>
                    <div className='alert alert-light overflow-auto' style={{maxHeight: '25vh'}}>
                        
                        <div className='row justify-content-center'>
                            <div className='col'>
                                <strong>{state.editPropShapeID}</strong>
                                
                            </div>
                        </div>

                        <div className='row justify-content-center'>
                            <div className='col-12'>
                                <ul>
                                    {
                                        Object.keys((layersSub[selectedVecLaySub] as VectorInterface).properties).map((propName: string) => {
                                            return <li key={propName} className="mb-2">
                                                {
                                                    (layersSub[selectedVecLaySub] as VectorInterface).properties[propName].fieldType == 'L' ? (
                                                        <div className="form-check">
                                                            <input className="form-check-input" name={propName}
                                                            type="checkbox"
                                                            checked={(layersSub[selectedVecLaySub].layer._layers[state.editPropShapeID].feature.properties[propName] as boolean) ?? undefined}
                                                            onChange={e => saveShapeAttr(e.target.name, e.target.checked)}
                                                            />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                                {propName.slice(0,-2)}
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <div className='input-group input-group-sm'>
                                                            <span className='input-group-text'>{propName.slice(0,-2)}</span>
                                                            <input className='form-control' name={propName}
                                                            id={`edit-attr-${propName}`}
                                                            type={inputTypes[((layersSub[selectedVecLaySub] as VectorInterface).properties[propName].fieldType) as InputTypes]}
                                                            value={(layersSub[selectedVecLaySub].layer._layers[state.editPropShapeID].feature.properties[propName] as string) ?? ""}
                                                            onChange={e => saveShapeAttr(e.target.name, e.target.value)}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        }
        {/* -------------------------------------------Edit-Shape-Properties-End-------------------------------------------- */}


        {/* -------------------------------------------List-Shapes-Start------------------------------------------ */}
        <div className='row justify-content-center' >
            <div className='col-11'>

                <div className='table-responsive' style={{maxHeight: '45vh'}}>
                    <table className='table table-sm table-bordered table-hover'>
                        <thead>
                            <tr>
                                <th className='text-center'>Edit</th>
                                <th className='text-center'>ID</th>
                                {
                                    Object.keys((layersSub[selectedVecLaySub] as VectorInterface).properties).map((key: string) => {
                                        return <th key={key}>{key.slice(0, -2)}</th>
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Object.keys((layersSub[selectedVecLaySub] as VectorInterface).layer._layers).map((geomId: string) => {
                                    return <tr key={geomId}>
                                        {
                                            state.editPropShapeID != geomId ? (
                                                <th className='text-center' onClick={() => setState({...state, editPropShapeID: geomId})}>
                                                    <i className="bi bi-pencil"></i>
                                                </th>

                                            ) : (
                                                <th className='text-center' onClick={()=>setState({...state, editPropShapeID: undefined})}>
                                                    <button className='btn btn-sm btn-close' type='button'></button>
                                                </th>
                                            )
                                        }
                                        <th className='text-center'>{geomId}</th>
                                        {
                                            Object.keys((layersSub[selectedVecLaySub] as VectorInterface).properties).map((key: string) => {
                                                if((layersSub[selectedVecLaySub] as VectorInterface).properties[key].fieldType == 'L'){
                                                    return <td key={key}>{(layersSub[selectedVecLaySub] as VectorInterface).layer._layers[geomId].feature.properties?.[key] ? (
                                                        <strong className='text-warning'>true</strong> ) : ( <strong className='text-primary'>false</strong> )
                                                    }</td>
                                                    
                                                } else if((layersSub[selectedVecLaySub] as VectorInterface).properties[key].fieldType == 'D'){
                                                    return <td key={key} style={{whiteSpace: 'nowrap'}}>{(layersSub[selectedVecLaySub] as VectorInterface).layer._layers[geomId].feature.properties?.[key]}</td>
                                                } else {
                                                    return <td key={key}>{(layersSub[selectedVecLaySub] as VectorInterface).layer._layers[geomId].feature.properties?.[key]}</td>
                                                }
                                            })
                                        }
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
        {/* -------------------------------------------List-Shapes-End-------------------------------------------- */}


        {/* -------------------------------------------Save-To-Shape-File-Start------------------------------------------ */}
        <div className='row justify-content-center'>
            <div className='col-auto'>
                <button
                onClick={()=>saveToShp()}
                disabled={isLoadingSub}
                className='btn btn-sm btn-light' type='button'>??????????????????, ?????? .shp ????????</button>
            </div>
        </div>

        {/* -------------------------------------------Save-To-Shape-File-End-------------------------------------------- */}

            
    </div>
}