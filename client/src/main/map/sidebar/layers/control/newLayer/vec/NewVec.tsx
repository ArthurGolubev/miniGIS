import * as React from 'react'
import * as L from 'leaflet'
import { VectorInterface } from '../../../../../types/main/LayerTypes'
import { useLayer } from '../../../../../../../analysis/stores/layer'
import { useMapObject } from '../../../../../../../analysis/stores/MapObject'



export const NewVec = ({showLayerAddControl}: {showLayerAddControl: (status: boolean) => void}) => {
    type vecTypes = 'Points' | 'Polylines' | 'Polygones'
    const [state, setState] = React.useState({vecName: '', vecType: 'Points' as vecTypes})
    const layers = useLayer(state => state.layers)
    const setLayers = useLayer(state => state.setLayers)


    const addVecLa = () => {
        let newGroupLayer = new L.FeatureGroup() as any
        const mapObject = useMapObject(state => state)
        newGroupLayer.addTo(mapObject)

        let data: VectorInterface
        data = {
            layerType: 'vector',
            type: state.vecType,
            layer: newGroupLayer,
            geom: undefined,
            positionInTable: Object.keys(layers).length +1,
            color: '#fd7e14',
            properties: {}
        }
        setLayers({ [state.vecName]: data })
        showLayerAddControl(undefined)
    }

        return <div className='row justify-content-start mt-2 mb-2 ms-2'>
            <div className='col-12'>

                <div className='row justify-content-start'>
                    <div className='col-12'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text">Тип слоя</span>
                            <select
                                className='form-select me-2'
                                defaultValue={'polylines'} 
                                onChange={e => setState({...state, vecType: e.target.value as vecTypes})}
                            >
                                <option value={'Points'}>Точки</option>
                                <option value={'Polylines'}>Линии</option>
                                <option value={'Polygones'}>Полигоны</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='row justify-content-start'>
                    <div className='col-12'>
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text bg-primary text-white">Название слоя</span>
                            <input
                                type="text"
                                className="form-control me-2"
                                onChange={e => setState({...state, vecName: e.target.value})}
                                placeholder={
                                    state.vecType == 'Points' ? 'Города...' :
                                    state.vecType == 'Polylines' ? 'Дороги...' :
                                    state.vecType == 'Polygones' ? 'Поля...' : ''
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className='row justify-content-center'>
                    <div className='col-12'>
                        <button onClick={()=>addVecLa()} className='btn btn-sm btn-success' type='button'>Добавить векторный слой</button>
                    </div>
                </div>

            </div>
        </div>
}