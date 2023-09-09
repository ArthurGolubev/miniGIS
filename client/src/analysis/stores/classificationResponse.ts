import { create } from "zustand";
import { devtools } from "zustand/middleware";

type response = {[key: string]: any}

interface classificationResponseType {
    responses: response
    // ---------------------------
    setResponse: (response: response) => void
}

export const useClassificationResponse = create<classificationResponseType>()(
    devtools(
        set => ({
            responses: {},
            // ----------------------------------
            setResponse: (response) => set(state => ({
                ...state,
                responses: {...state.responses, ...response}
            }))
        })
    )
)