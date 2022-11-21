import * as React from 'react'
import * as bootstrap from 'bootstrap'
import { ReactElement } from 'react'
import { MapLayer } from '../../../types/newTypes'


export const LayerInfo = ({layer}: {layer: MapLayer}) => {
    const tooltipRef = React.useRef()

    let cls: string
    switch (layer.layerType) {
        case "preview":
            cls = "link-danger"
            break
        case "shape":
            cls = "link-warning"
            break
        case "result":
            cls = "link-success"
            break
        default:
            console.log("DEFAULT FROM LayerType.tsx")
            break;
    }
    
    React.useEffect(() => {
        let tooltip = new bootstrap.Tooltip(tooltipRef.current, {
            html: true,
            title: "test",
            // title: `<div>${layer.layer.date}</div><div>${layer.layer.cloud}</div>`,
            placement: "bottom",
            trigger: "hover",
        })    
    })        
    return <div>
        <a style={{whiteSpace: "pre-line"}} className={cls} ref={tooltipRef}>
            {layer.layerType}
        </a>
    </div>
}