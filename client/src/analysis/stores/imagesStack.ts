import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface SentinelType {
    [sceneNameId: string]: {
        meta: {
            mgrsTile: string
            productId: string
            granuleId: string
            bands: Array<string>
        }
        status: "wait" | "loading" | "downloaded"
    } | {
        meta: {
            bands: Array<string>
        }
    }
}

export interface LandsatType {
    [sceneNameId: string]: {
        meta: {
            sensorId: string
            path: string
            row: string
            productId: string
            bands: Array<string>
        }
        status: "wait" | "loading" | "downloaded"
    } | {
        meta: {
            bands: Array<string>
        }
    }
}

interface ImagesStackType {
    sentinel: SentinelType
    landsat: LandsatType
    // ----------------------------------------
    setImagesStack: (satellite: SentinelType | LandsatType) => void
}

export const useImagesStack = create<ImagesStackType>()(
    devtools(
        set => ({
            sentinel: undefined,
            landsat: undefined,
            // --------------------------------------
            setImagesStack: (satellite) => set(state => ({
                ...state,
                ...satellite
            }))
        })
    )
)