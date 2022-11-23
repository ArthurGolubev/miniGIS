import * as React from 'react'
import { layers as la, shapeEdit }  from '../../../rv'
import { LayerInfo } from './LayerInfo'
import { MapLayer, MapLayers, Shape } from '../../../types/newTypes'
import { useReactiveVar } from '@apollo/client'
import { ShapeHandler } from './ShapeHandler'


export const AttributeTable = ({mapLayers}: {mapLayers: MapLayers}): JSX.Element => {
    console.log("LAYERSUB ->", mapLayers)
    const shapeEditSub = useReactiveVar(shapeEdit)

    const opacityHandler = (layerKey: string, value: number) => {
        let layer = mapLayers[layerKey].layer
        switch(mapLayers[layerKey].layerType){
            case 'preview':
                layer.setOpacity(value)
                break
            case 'shape':
                layer.setStyle({
                    opacity: value * 2,
                    fillOpacity: value
                })
                break
            case 'result':
                layer.setOpacity(value)
                break
            default:
                console.log('Default case from AttributeTable.tsx')
        }
    }

    

    const changeLayerOrder = (changeKey: string, changeLayerTo: string) => {
        let newPosition = changeLayerTo == 'up' ? ( mapLayers[changeKey].positionInTable + 1 ) : ( mapLayers[changeKey].positionInTable - 1 )
        let exchangeLayer = Object.entries(mapLayers).find((item) => item[1].positionInTable == newPosition)

        if(exchangeLayer != undefined){
            let exchangeKey = exchangeLayer[0]
            la({
                ...mapLayers,
                [changeKey]: {
                    ...mapLayers[changeKey],
                    positionInTable: newPosition
                },
                [exchangeKey]: {
                    ...mapLayers[exchangeKey],
                    positionInTable: changeLayerTo == 'up' ? (mapLayers[exchangeKey].positionInTable - 1) : (mapLayers[exchangeKey].positionInTable + 1)
                }
            })
            changeLayerTo == 'up' ? ( mapLayers[changeKey].layer.bringToFront() ) : ( mapLayers[changeKey].layer.bringToBack() )
        }
    }

    const isPoint = (layer: MapLayer) => {
        let isShape = layer.layerType == 'shape' ? layer as Shape : false
        if(isShape){
            return isShape.type == 'Точка' ? true : false
        } else {
            return false
        }
    } 


    return <div>
        
        <div className='row justify-content-center'>
            <div className='col-12'>
                {shapeEditSub != '' && <ShapeHandler />}
            </div>
        </div>

        <div className='row justify-content-center'>
            <div className='col-12'>
                <table className='table'>
                    <thead>
                        <tr className='text-center'>
                            <th scope='col'>#</th>
                            <th scope='col'>Тип</th>
                            <th scope='col'>Прозрачность</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(mapLayers).sort((a: any, b: any) => b[1].positionInTable - a[1].positionInTable).map((item, iter: number) => {
                                let key = item[0]
                                let layer = item[1]
                                return <tr key={key} className='text-center' style={{fontSize: "0.8em"}}>
                                    <td>
                                        <span className='text-muted'>{iter + 1}</span>
                                        <div>
                                            <input
                                                type='checkbox'
                                                onChange={e => opacityHandler(key, e.target.checked ? (
                                                    parseInt((document.querySelector(`#layer-${key}`) as HTMLInputElement).value) / 100
                                                ) : ( 0 )
                                                )}
                                                defaultChecked={true}
                                                disabled={isPoint(layer)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <LayerInfo layer={mapLayers[key]} layerKey={key} />
                                        <button className='btn btn-sm btn-light' type='button'>
                                            <i className="bi bi-arrow-up" onClick={()=>changeLayerOrder(key, 'up')}></i>
                                        </button>
                                        <button className='btn btn-sm btn-light' type='button'>
                                            <i className="bi bi-arrow-down" onClick={()=>changeLayerOrder(key, 'down')}></i>
                                        </button>
                                    </td>
                                    <td>
                                        <input
                                            type='number'
                                            onChange={e => opacityHandler(key, parseInt(e.target.value) / 100) }
                                            min={0}
                                            max={100}
                                            defaultValue={layer.layerType == 'shape' ? 25 : 100}
                                            id={`layer-${key}`}
                                        />
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>

    </div>
}