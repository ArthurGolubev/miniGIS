import { layerGroup } from "leaflet"
import * as React from "react"
import Plot from "react-plotly.js"
import { useOutletContext } from "react-router"


export const Legend = () => {

    const [img] = useOutletContext<any>()

    return <div className='row justify-content-center'>
        <div className='col-12'>
            <h5>Легенда</h5>
            
            <div className='row justify-content-center'>
                <div className='col-2' style={{marginTop: '10%'}}>
                    {
                        Object.keys(img.statistic.colors).map(key => {
                            return <div key={key} className='row justify-content-center mt-1'>
                                <div className='col-auto'>
                                    {key}
                                </div>
                                <div className='col' style={{backgroundColor: img.statistic.colors[key]}}>
                                    
                                </div>
                            </div>
                        })
                    }        
                </div>
                <div className='col-10'>
                    <Plot data={[
                        {
                            x: Object.keys(img.statistic.pixels_per_class),
                            y: Object.values(img.statistic.pixels_per_class) as Array<number>,
                            type: 'bar',
                            marker: {color: Object.values(img.statistic.colors)}
                        }
                    ]}
                    layout={{
                        title: 'количество пикселей / класс'
                    }}
                    />
                </div>
            </div>
            
            {/* <div className='row justify-content-center'>
                <div className='col-10'>
                    <Plot data={[
                        {
                            x: Object.keys(img.statistic.pixels_per_class),
                            y: Object.values(img.statistic.pixels_per_class),
                            type: 'bar',
                            marker: {color: Object.values(img.statistic.colors)}
                        }
                    ]}
                    layout={{
                        title: 'test pixels/classes'
                    }}
                    />
                </div>
            </div> */}

        </div>
    </div>
}