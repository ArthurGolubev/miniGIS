import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface SelectedImageType {
    metadata: any
    imgUrl: string
    sensor: string
    systemIndex: string
    // ------------------------------------------
    setSelectedImage: (img: any) => void
}

export const useSelectedImage = create<SelectedImageType>()(
    devtools(
        set => ({
            metadata: undefined,
            imgUrl: undefined,
            sensor: undefined,
            systemIndex: undefined,
            // --------------------------------------------
            setSelectedImage: (img) => set(state => ({
                ...state,
                ...img
            }))
        })
    )
)