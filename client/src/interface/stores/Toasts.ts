import { create } from "zustand";
import { devtools } from "zustand/middleware";


export interface ToastDataType {
    datetime: Date,
    header: string,
    message: string,
    show: boolean
    color: string
}


export interface ToastDataWithImgType extends ToastDataType{
    img_url: string
    coordinates: Array<number>
    operation: string
}

interface ToastsType {
    [key: string]: ToastDataType | ToastDataWithImgType
}

export interface ToastWithClassificationResultsType {
    [key: string]: ToastDataWithImgType
}

interface toastStoreType {
    toasts: ToastsType,
    setToast: (toast: ToastsType) => void    
}


export const useToasts = create<toastStoreType>()(
    devtools(
        set => ({
            toasts: undefined,
            // -------------------------------------------------
            setToast: (toast) => set(state => ({
                ...state,
                toasts: { ...state.toasts, ...toast }
            }))
        })
    )
)