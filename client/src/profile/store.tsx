import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ax } from '../index'

export interface AlgorithmType {
    id: string
    name: string
    user_id: string
    start_date: string
    sensor: string
    poi: string
    mask: string
    last_file_name: string
    end_date: string
    bands: string
    alg_param: number
    alg_name: string
}


interface ProfileState {
    userAlg: {
        [key: string]: AlgorithmType
    }
    username: string | undefined
    fetchUserAlg: () => void 
}   


export const useProfileStore = create<ProfileState>()(
    devtools(
        set =>({
            userAlg: {},
            username: undefined,

            fetchUserAlg: async () => {
                const alg = await ax.get('/algorithm/all')
                let usersAlg: {[key: string]: AlgorithmType} = {}
                alg.data.forEach((alg: AlgorithmType) => usersAlg[alg.id] = alg)
                set(() => ({userAlg: usersAlg}))
            },
        })
    )
)