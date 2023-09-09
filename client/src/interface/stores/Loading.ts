import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LoadingType {
    isLoading: boolean,
    // -------------------------------
    setLoading: (status: boolean) => void
}

export const useLoading = create<LoadingType>()(
    devtools(
        set => ({
            isLoading: false,
            // --------------------
            setLoading: (status) => set(state => ({...state, isLoading: status}))
        })
    )
)