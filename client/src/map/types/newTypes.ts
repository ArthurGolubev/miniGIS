interface BasicLayer {
    layer: {
        setOpacity: (n: number) => void
        setStyle: ({}: {opacity: number, fillOpacity: number}) => void
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
}



export interface GoogleRaster extends BasicLayer {
    date: string
    cloud: string
}



export interface ResultRaster extends BasicLayer {

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