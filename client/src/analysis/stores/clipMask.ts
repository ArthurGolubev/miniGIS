import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ClipMaskType {
    layer: undefined
    mask: {}
    // ------------------------
    setLayer: (layer: any) => void
    setMask: (mask: any) => void
}


export const useClipMask = create<ClipMaskType>()(
    devtools(
        set => ({
            layer: undefined,
            mask: undefined,
            // ----------------------------------
            setLayer: (layer) => set(state => ({
                ...state,
                layer: layer
            })),
            setMask: (mask) => set(state => ({
                ...state,
                mask: mask
            }))
        })
    )
)