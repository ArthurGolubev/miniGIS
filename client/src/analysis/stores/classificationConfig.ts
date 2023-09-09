import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface ClassificationConfigType {
    method: string
    classes: number
    // -------------------------------------
    setMethod: (method: string) => void
    setClasses: (number: number) => void
}


export const useClassificationConfig = create<ClassificationConfigType>()(
    devtools(
        set => ({
            method: 'KMean',
            classes: 0,
            // ---------------------
            setMethod: (method) => set(state => ({...state, method: method})),
            setClasses: (number) => set(state => ({...state, classes: number}))
        })
    )
)