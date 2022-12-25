import * as React from "react"
import { LayerAddControl } from "./LayerAddControl"
import { LayerList } from "./LayerList"



export const Layers = () => {
    
    return <div className='row justify-content-center'>
        <div className='col-12'>
            <LayerAddControl />
            <LayerList />
        </div>
    </div>
}