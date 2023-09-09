import * as React from 'react'
import * as L from 'leaflet'
import { RasterInterface } from '../../../../../types/main/LayerTypes'
import { useLayer } from '../../../../../../../analysis/stores/layer'
import { useMapLayerControl } from '../../../../../../../analysis/stores/mapLayerControl'
import { useMapObject } from '../../../../../../../analysis/stores/MapObject'



export const OpenRaster = ({showLayerAddControl}: {showLayerAddControl: (p: boolean) => void}) => {
    const [state, setState] = React.useState({layerName: ''})
    const setLayers = useLayer(state => state.setLayers)
    const layers = useLayer(state => state.layers)
    const mapLayerControl = useMapLayerControl(state => state.mapLayerControl)
    const mapObject = useMapObject(state => state)
    
    const addRasterLayer = () => {
        let newGroupLayer = new L.FeatureGroup() as any
        newGroupLayer.addTo(mapObject)

        let data: RasterInterface
        data = {
            name: state.layerName,
            layerType: 'raster',
            layer: newGroupLayer,
            imgs: {},
            positionInTable: Object.keys(layers).length +1,
        }
        setLayers({ [state.layerName]: data })
        mapLayerControl.addOverlay(newGroupLayer, state.layerName)
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