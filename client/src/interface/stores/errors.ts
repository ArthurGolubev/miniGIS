import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface ErrorType {
    periodError: boolean
    // --------------------------------------
    setPeriodError: (status: boolean) => void
}

export const useErrors = create<ErrorType>()(
    devtools(
        set => ({
            periodError: undefined,
            // --------------
            setPeriodError: (status) => set(state => ({
                ...state,
                periodError: status
            }))
        })
    )
)