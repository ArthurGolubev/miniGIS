import { create } from 'zustand'
import { devtools } from 'zustand/middleware'


interface createAlgorithmType {
    step: number
    algName: string
    algType: string
    // ------------------------------------------
    setStep: (step: number) => void
    setAlgName: (name: string) => void
    setAlgType: (type: string) => void
}

export const useCreateAlgorithm = create<createAlgorithmType>()(
    devtools(
        set => ({
            step: 0,
            algName: undefined,
            algType: undefined,
            // ----------------------------------------------------
            setStep: (step) => set(state => ({
                ...state,
                step: step
            })),
            setAlgName: (name) => set(state => ({
                ...state,
                algName: name
            })),
            setAlgType: (type) => set(state => ({
                ...state,
                algType: type
            }))
        })
    )
)