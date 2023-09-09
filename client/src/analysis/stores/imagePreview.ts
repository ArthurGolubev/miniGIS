import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ImagePreview {
    imagePreview: Array<any>
    // ------------------------------------
    setImagePreview: (preview: any) => void
}

export const useImagePreview = create<ImagePreview>()(
    devtools(
        set => ({
            imagePreview: [],
            // -------------------------
            setImagePreview: (preview) => set(state => ({
                ...state,
                imagePreview: [...state.imagePreview, preview]
            }))
        })
    )
)