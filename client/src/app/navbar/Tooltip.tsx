import * as React from 'react'
import * as bootstrap from 'bootstrap'
import tem from './test.html'


export const Tooltip1 = () => {
    const tooltipRef = React.useRef()
    
    
    React.useEffect(() => {
        let tooltip = new bootstrap.Tooltip(tooltipRef.current, {
            title: "some tooltip",
            placement: "right",
            trigger: "hover",
            template: tem
        })    
    })        
    return <div className='py-2'>
        <button onClick={()=>console.log()} className='btn btn-sm btn-success' type='button' ref={tooltipRef}>btn</button>
    </div>
}