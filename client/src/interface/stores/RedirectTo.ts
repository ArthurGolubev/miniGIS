import { create } from "zustand";
import { devtools } from "zustand/middleware";


interface RedirectToType {
    path: string
    // -------------------------------------
    setRedirectTo: (path: string) => void
}

export const useRedirectTo = create<RedirectToType>()(
    devtools(
        set => ({
            path: undefined,
            // ---------------------------------
            setRedirectTo: (path) => set(state => ({...state, path}))
        })
    )
)