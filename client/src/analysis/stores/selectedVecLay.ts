import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface SelectedVecLayType {
    selectedVecLay: string
    // -----------------------------
    setSelectedVecLay: (selected: string) => void
}

export const useSelectedVecLay = create<SelectedVecLayType>()(
    devtools(
        set => ({
            selectedVecLay: undefined,
            // -------------------------------------
            setSelectedVecLay: (selected) => set(state => ({
                ...state,
                selectedVecLay: selected
            }))
        })
    )
)