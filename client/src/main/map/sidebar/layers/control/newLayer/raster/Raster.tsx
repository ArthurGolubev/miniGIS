import * as React from 'react'
import * as L from 'leaflet'
import { layers, mapLayerControl, mapObj } from '../../../../../rv'
import { useReactiveVar } from '@apollo/client'
import { RasterInterface } from '../../../../../types/main/LayerTypes'



export const Raster = ({showLayerAddControl}: {showLayerAddControl: (p: boolean) => void}) => {
    const mapObjSub = useReactiveVar(mapObj)
    const layersSub = useReactiveVar(layers)
    const mapLayerControlSub = useReactiveVar(mapLayerControl) as any
    const [state, setState] = React.useState({layerName: ''})
    
    const addRasterLayer = () => {
        let newGroupLayer = new L.FeatureGroup() as any
        newGroupLayer.addTo(mapObjSub)

        let data: RasterInterface
        data = {
            name: state.layerName,
            layerType: 'raster',
            layer: newGroupLayer,
            imgs: {},
            positionInTable: Object.keys(layersSub).length +1,
        }
        layers({ ...layersSub, [state.layerName]: data })
        mapLayerControlSub.addOverlay(newGroupLayer, state.layerName)
        showLayerAddControl(undefined)
    }


    return <div className='row justify-content-start mt-2 mb-2 ms-2'>
    <div className='col-12'>

        <div className='row justify-content-start'>
            <div className='col-12'>
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text">Название</span>
                    <input
                    type="text"
                    className="form-control me-2"
                    placeholder='слой классификации'
                    onChange={e => setState({...state, layerName: e.target.value})}
                    />
                </div>
            </div>
        </div>

        <div className='row justify-content-center'>
            <div className='col-12'>
                <button onClick={()=>addRasterLayer()} className='btn btn-sm btn-success' type='button'>Добавить растровый слой</button>
            </div>
        </div>

    </div>
</div>
}