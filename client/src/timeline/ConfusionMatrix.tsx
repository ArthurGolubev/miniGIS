import * as React from 'react'
import { useOutletContext } from "react-router-dom"
import Plot from 'react-plotly.js'
import { Annotations } from 'plotly.js'



export const ConfusionMatrix = () => {
    const [img] = useOutletContext<any>()

    console.log(img.statistic.confusion_matrix)
    let classes = Array.from(Array(img.statistic.confusion_matrix.length).keys()).map(n => 'Class ' + (n+1))
    console.log('classes -> ', classes)

    let colorscaleValue: Array<[number, string]> = [
        [0, '#3D9970'],
        [36000, '#001f3f']
    ]

    let annotations: Array<Partial<Annotations>> = []
    for( var i = 0; i < classes.length; i++){
        for( var j =0; j < classes.length; j++){
            let currentValue = img.statistic.confusion_matrix[i][j]
            let result = {
                // xref: "x",
                // yref: "y",
                xaxis: {
                    side: 'top'
                },
                x: classes[j],
                y: classes[i],
                text: currentValue,
                font: {
                    family: 'Arial',
                    size: 12,
                    // color: 'rgb(50, 171, 96)'
                    color: 'white'
                },
                showarrow: false,
            }
            annotations.push(result)
        }
    }

    return <div>
        <Plot
            data={[
            {
                x: classes,
                y: classes,
                z: img.statistic.confusion_matrix,
                type: 'heatmap',
                colorscale: colorscaleValue,
            },
            ]}
            layout={
                {
                    title: 'Матрица путаницы',
                    annotations: annotations
                }
            }
        />
    </div>
}