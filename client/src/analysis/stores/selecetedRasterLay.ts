import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SelectedRasterLayType {
    selectedRasterLay: string
    // -------------------------------------
    setSelectedRasterLay: (selected: string) => void
}

export const useSelectedRasterLay = create<SelectedRasterLayType>()(
    devtools(
        set => ({
            selectedRasterLay: undefined,
            // ------------------------------------------
            setSelectedRasterLay: (selected) => set(state => ({
                ...state,
                selectedRasterLay: selected
            })) 
        })
    )
)