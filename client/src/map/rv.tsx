import { makeVar } from "@apollo/client";

interface geom {
    [index: number]: {
        shape: string
        outer_vertex: number
        inner_vertex?: number | undefined
        text: string
    } 
}

export const mapData = makeVar({} as geom)