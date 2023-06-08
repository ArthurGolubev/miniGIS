import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface useMainStoreType {
    isLoading: boolean
    setLoading: (status: boolean) => void
}



export const useMainStore = create<useMainStoreType>()(
    devtools(
        set => ({
            isLoading: false,

            setLoading: (status) => set((state) => ({...state, isLoading: status}))
        })
    )
)