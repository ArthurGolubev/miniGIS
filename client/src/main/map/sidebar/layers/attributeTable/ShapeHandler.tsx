import * as React from 'react'
import { useReactiveVar } from '@apollo/client'
import { layers, shapeEdit } from '../../../rv'
import { MapLayer, MapLayers, Shape } from '../../../types/newTypes'


export const ShapeHandler = () => {
    const layersSub: MapLayers = useReactiveVar(layers)
    const shapeEditSub = useReactiveVar(shapeEdit)

    const changeColorHandler = (shape: Shape, color: string) => {
        shape.layer.setStyle({color})
        let c = document.querySelector(`#layer-info-${shapeEditSub}`) as HTMLLinkElement
        c.style.color = color
    }

    let shape = layersSub[shapeEditSub] as Shape
    return <div className='row justify-content-start mt-4'>
        <div className='col-11'>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    {
                        shape.type != 'Points' && <div>
                            <p>Цвет фигуры</p>
                            <input type="color" defaultValue={shape.color} onChange={e => changeColorHandler(shape, e.target.value )}/>
                        </div>
                    }
                </div>
            </div>

            <div className='row justify-content-center'>
                <div className='col-12'>
                    <div className="input-group input-group-sm mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Small</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                    </div>
                    <div className="input-group input-group-sm mb-3">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Small</span>
                        <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" />
                    </div>
                </div>
            </div>
        </div>
    </div>
}