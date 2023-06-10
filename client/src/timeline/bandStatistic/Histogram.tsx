import * as React from "react"
import Plot from "react-plotly.js"



export const Histogram = ({band}: {band: any}) => {

    const maxVal = Math.max(...band.histogram.y.slice(5)) + 20
    console.log('maxValue -> ', maxVal)


    return <div className='row justify-content-center mt-3'>
        <div className='col-12'>
            <Plot 
                data={[
                    {
                        x: band.histogram.x.slice(5),
                        y: band.histogram.y.slice(5),
                        type: 'bar',
                    },

                ]}
                layout={{
                    title: `Гистограмма канала ${band.band}`,
                    yaxis: {range: [0, maxVal]}
                }}
                />
        </div>
    </div>
}