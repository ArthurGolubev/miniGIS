import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface selectedFilesType {
    satellite: string
    product: string
    files: any
    // ------------------------------
    setSatellite: (satellite: string) => void
    setFiles: (files: Array<any>) => void
    setProduct: (product: string) => void
}

export const useSelectedFiles = create<selectedFilesType>()(
    devtools(
        set => ({
            satellite: undefined,
            product: undefined,
            files: undefined,
            // --------------------------------------------
            setSatellite: (satellite) => set(state => ({
                ...state,
                satellite: satellite
            })),
            setFiles: (files) => set(state => ({
                ...state,
                files: files
            })),
            setProduct: (product) => set(state => ({
                ...state,
                product: product
            }))
        })
    )
)