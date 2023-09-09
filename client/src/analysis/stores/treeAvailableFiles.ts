import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface TreeAvailableFilesType {
    treeAvailableFiles: any
    // -------------------------------------------
    setTreeAvailableFiles: (tree: any) => void
}

export const useTreeAvailableFiles = create<TreeAvailableFilesType>()(
    devtools(
        set => ({
            treeAvailableFiles: undefined,
            // -------------------------------------------
            setTreeAvailableFiles: (tree) => set(state => ({
                ...state,
                treeAvailableFiles: tree
            }))
        })
    )
)