import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface MapLayerControl {
    mapLayerControl: any
    // -------------------------------------
    setMapLayerControl: (mapLayerControl: any) => void
}

export const useMapLayerControl = create<MapLayerControl>()(
    devtools(
        set => ({
            mapLayerControl: undefined,
            // ------------------------------------
            setMapLayerControl: (mapLayerControl) => set(state => ({
                ...state,
                mapLayerCpntrol: mapLayerControl
            }))
        })
    )
)