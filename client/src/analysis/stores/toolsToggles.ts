import { create } from "zustand";
import { devtools } from "zustand/middleware";

type toggleType = {'mask': boolean} | {'POI': boolean}

interface ToolsTogglesType {
    mask: boolean
    POI: boolean
    // --------------------------
    showTools: (toggle: toggleType) => void
}


export const useToolsToggles = create<ToolsTogglesType>()(
    devtools(
        set => ({
            mask: false,
            POI: false,
            // ------------------------------------------------------
            showTools: (toggle) => set(state => ({
                ...state,
                ...toggle
            }))
        })
    )
)