export interface Layer {
    options: object
    toGeoJSON: () => {}
}


export interface MapObject extends Layer {
    pm: {
        getGeomanLayers: () => Array<Layer>
        enableDraw: (shapeType: string, {}) => void,
        disableDraw: () => void,
    },
    removeLayer: (layer: any) => void,
}

