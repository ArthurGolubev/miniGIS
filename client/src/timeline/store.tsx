import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { AlgorithmType } from '../profile/store'


interface TimelineStore {
    algData: AlgorithmType | undefined
    timalineImages: Array<any>
    isProgressBar: undefined | {iter: number, iters: number}
    addImageToTimeline: (img: any) => void
}   


export const useTimelineStore = create<TimelineStore>()(
    devtools(
        set => ({
            algData: undefined,
            timalineImages: [],
            isProgressBar: undefined,


            addImageToTimeline: (classification) => 
            set((state) => {
                console.log(classification)
                let progress = {iter: 0, iters: 0}
                if(classification.iter / classification.iters < 1){
                    progress.iter = classification.iter
                    progress.iters = classification.iters
                } else {
                    progress = undefined
                }
                let arrayBufferView = new Uint8Array(classification.img)
                let statistic = JSON.parse(classification.meta)
                console.log(progress)
                const blob = new Blob([arrayBufferView], {type:"image/jpeg"} )
                return {...state,
                    timalineImages: [
                        ...state.timalineImages, {img: blob, date: new Date(classification.date), statistic}
                    ],
                    isProgressBar: progress
                    }
            }),
        })
    )
)
