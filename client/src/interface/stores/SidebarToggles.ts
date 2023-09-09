import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type show = {'LayerList': boolean} | {'DetailVec': boolean} | {'DetailRaster': boolean}

interface useSidebarTogglesType {
    show: {
        LayerList: boolean,
        DetailVec: boolean,
        DetailRaster: boolean,
    },
    setToggle: (show: show) => void
}


export const useSidebarToggles = create<useSidebarTogglesType>()(
    devtools(
        set => ({
            show: {
                LayerList: false,
                DetailVec: false,
                DetailRaster: false,
            },
            // -----------------------------
            setToggle: (toggles) => set((state) => ({
                ...state,
                show: {
                    ...state.show,
                    ...toggles
                }
            }))

        })
    )
)