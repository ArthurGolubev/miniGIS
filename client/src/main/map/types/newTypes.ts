interface BasicLayer {
    layer: {
        setOpacity: (n: number) => void
        setStyle: ({}: {opacity?: number, fillOpacity?: number, color?: string}) => void
        bringToFront: () => void
        bringToBack: () => void
        addLayer: (geom: any) => void
        _layers: {
            [geomId: string]: {
                feature: {
                    properties: {
                        [attrName: string]: string | boolean
                    }
                }
            }
        }
        toGeoJSON: () => object
    }
    layerType: 'preview' | 'shape' | 'result'
    positionInTable: number
}


export interface Shape extends BasicLayer {
    type: 'Points' | 'Polylines' | 'Polygones'
    outer_vertex?: number | undefined
    inner_vertex?: number | undefined
    text?: string,
    geom: any | undefined
    color?: string
    properties: {
        [propName: string]: {
            fieldType: string,
        }
    },
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
        enableDraw: (shapeType: string, {}) => void,
        disableDraw: () => void,
    }
}

