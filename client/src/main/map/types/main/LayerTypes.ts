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
    layerType: 'vector' | 'raster'
    positionInTable: number
}

export interface ClassificationRaster extends BasicLayer {
    k?: number
    resultType?: string
    name: string
}
export interface PreviewRaster extends BasicLayer{
    spacecraft?: string
    date?: string
    cloud?: string
    name: string
}
export interface RasterInterface extends BasicLayer {
    name: string | undefined
    imgs: {
        [key: string]: ClassificationRaster | PreviewRaster
    }
}

export interface VectorInterface extends BasicLayer {
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


export type MapLayer = VectorInterface | RasterInterface

export interface MapLayers {
    [key: string]: MapLayer
}
