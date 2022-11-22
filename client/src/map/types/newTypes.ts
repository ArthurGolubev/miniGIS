interface BasicLayer {
    layer: {
        setOpacity: (n: number) => void
        setStyle: ({}: {opacity?: number, fillOpacity?: number, color?: string}) => void
        bringToFront: () => void
        bringToBack: () => void
        
    }
    layerType: 'preview' | 'shape' | 'result'
    positionInTable: number
}


export interface Shape extends BasicLayer {
    type: 'Точка' | 'Полилиния' | 'Полигон'
    outer_vertex: number
    inner_vertex?: number | undefined
    text?: string,
    geom: any
    color?: string
}



export interface GoogleRaster extends BasicLayer {
    spacecraft: string
    date: string
    cloud: string
}



export interface ResultRaster extends BasicLayer {
    k?: number
    resultType: string
}



export type MapLayer = Shape | GoogleRaster | ResultRaster
export interface MapLayers {
    [key: string]: MapLayer
}


export interface Layer {
    options: object
    toGeoJSON: () => {}
}


export interface MapObject extends Layer {
    pm: {
        getGeomanLayers: () => Array<Layer>
    }
}