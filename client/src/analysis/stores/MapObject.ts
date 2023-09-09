import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
    setMapObject: (mapObject: any) => void
}

export const useMapObject = create<MapObject>()(
    devtools(
        set => ({
            options: undefined,
            pm: undefined,
            removeLayer: undefined,
            toGeoJSON: undefined,
            // ---------------------------------
            setMapObject: (mapObject) => set(state => ({
                ...state,
                ...mapObject
            }))
        })
    )
)