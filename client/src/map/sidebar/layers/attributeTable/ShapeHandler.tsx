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
            {
                shape.type != 'Точка' && <div>
                    <p>Цвет фигуры</p>
                    <input type="color" defaultValue={shape.color} onChange={e => changeColorHandler(shape, e.target.value )}/>
                </div>
            }
        </div>
    </div>
}