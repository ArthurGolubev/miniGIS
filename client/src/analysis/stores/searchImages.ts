import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface searchMetaType {
    poi?: Array<any>
    startDate?: string,
    endDate?: string,
    sensor?: string
    images?: Array<any>
}

interface searchImagesType extends searchMetaType {
    
    
    // -----------------------------------------
    setSearchImages: (meta: searchMetaType) => void
}


export const useSearchImages = create<searchImagesType>()(
    devtools(
        set => ({
            poi: [],
            startDate: undefined,
            endDate: undefined,
            sensor: undefined,
            images: undefined,
            // -----------------------------------------
            setSearchImages: (meta) => set(state => ({
                ...state,
                ...meta
            }))
        })
    )
)

// export const searchImages = makeVar({
//     poi: [],
//     period: {
//         start: "",
//         end: ""
//     },
//     sensor: "S2",
//     images: []
// })
