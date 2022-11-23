import * as React from 'react'
import * as bootstrap from 'bootstrap'
import { GoogleRaster, MapLayer, ResultRaster, Shape } from '../../../types/newTypes'
import { shapeEdit } from '../../../rv'

export const LayerInfo = ({layer, layerKey}: {layer: MapLayer, layerKey: string}) => {
    const tooltipRef = React.useRef()

    let layerInfo
    let cls: string
    let title: string
    let content: string
    switch (layer.layerType) {
        case "preview":
            layerInfo = layer as GoogleRaster
            cls = "link-danger"
            title = layerInfo.spacecraft
            content = `
                <ul class='list-group list-group-flush'>
                    <li class='list-group-item d-flex justify-content-between align-items-center'>
                        Дата <span>${layerInfo.date}</span>
                    </li>
                    <li class='list-group-item d-flex justify-content-between align-items-center'>
                        Облачность <span>${layerInfo.cloud} %</span>
                    </li>
                </ul>
            `
            break
        case "shape":
            layerInfo = layer as Shape
            cls = "link-warning"
            title = layerInfo.type
            content = `
                <ul class='list-group list-group-flush'>
                    <li class='list-group-item d-flex justify-content-between align-items-center'>
                        Внешних вершин <span>${layerInfo.outer_vertex}</span>
                    </li>
                    <li class='list-group-item d-flex justify-content-between align-items-center'>
                        Внутренних вершин <span>${layerInfo.inner_vertex ?? 0}</span>
                    </li>
                </ul>
            `
            break
        case "result":
            layerInfo = layer as ResultRaster
            cls = "link-success"
            title = 'Классификация'
            content = `
                <ul class='list-group list-group-flush'>
                    <li class='list-group-item d-flex justify-content-between align-items-center'>
                        Тип <span>${layerInfo.resultType}</span>
                    </li>
                    <li class='list-group-item d-flex justify-content-between align-items-center'>
                        Классов <span>${layerInfo.k}</span>
                    </li>
                </ul>
            `
            break
        default:
            console.log("DEFAULT FROM LayerType.tsx -> ", layer.layerType)
            break;
    }
    








    React.useEffect(() => {
        let tooltip = new bootstrap.Popover(tooltipRef.current, {
            html: true,
            title: title,
            content: content,
            placement: "bottom",
            trigger: "hover",
        })    
        if(layer.layerType == 'shape'){
            let elem = document.querySelector(`#layer-info-${layerKey}`) as HTMLLinkElement
            let shape = layer as Shape
            if(shape.type != 'Точка'){
                elem.addEventListener("click", ()=>{
                    shapeEdit(layerKey)
                    tooltip.hide()
                })
                elem.style.color = shape.color
            } else {
                elem.addEventListener("click", () => {
                    shapeEdit('')
                    tooltip.hide()
                })
            }
        }
    })

    return <div>
        <a style={{whiteSpace: "pre-line"}} ref={tooltipRef} id={`layer-info-${layerKey}`}>
            {layer.layerType}
        </a>
    </div>
}