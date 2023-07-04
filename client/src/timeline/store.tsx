import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { AlgorithmType } from '../profile/store'
import { ax } from '..'
import { socket } from '../app/socket'
import { useMainStore } from '../app/store'


interface ClassificationResultType {
    img: any
    date: Date
    statistic: any
    preview: {
        img_url : string
        bounds: Array<Array<number>>
    }
}


interface TimelineStore {
    algData: AlgorithmType | undefined
    timalineImages: Array<ClassificationResultType>
    isProgressBar: undefined | {iter: number, iters: number}
    algorithmDetail: {
        alg_name: string | undefined
        alg_param: string | undefined
        name: string | undefined
        bands: string | undefined
    }
    
    fetchAlgDetailById: (id: string) => void
    addImageToTimeline: (img: any) => void
}   


export const useTimelineStore = create<TimelineStore>()(
    devtools(
        set => ({
            algData: undefined,
            timalineImages: [],
            isProgressBar: undefined,
            algorithmDetail: {
                alg_name: undefined,
                alg_param: undefined,
                name: undefined,
                bands: undefined
            },


            addImageToTimeline: (data) => 
            set((state) => {
                console.log(data)
                let progress = {iter: 0, iters: 0}
                if((data.progress.iter - data.progress.iters) != 0){
                    progress.iter = data.progress.iter
                    progress.iters = data.progress.iters
                } else {
                    progress = undefined
                }
                let arrayBufferView = new Uint8Array(data.classification.img)
                let statistic = JSON.parse(data.classification.meta)
                console.log(progress)
                const blob = new Blob([arrayBufferView], {type:"image/jpeg"} )
                return {...state,
                    timalineImages: [
                        ...state.timalineImages, {
                            img: blob,
                            date: new Date(data.classification.date),
                            statistic,
                            preview: data.preview
                        }
                    ],
                    isProgressBar: progress
                    }
            }),

            fetchAlgDetailById: async (id) => {
                let response = await ax.get(`/algorithm/detail/${id}`)
                set((state) => ({...state, algorithmDetail: response.data, timalineImages: []}))
                let path = response.data.mask.split('/').slice(0, -2)
                socket.emit("algorithm/timeline", {path: path.join('/')})

            }
        })
    )
)
