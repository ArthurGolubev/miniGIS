import * as React from "react"
import { useOutletContext } from "react-router"
import { Histogram } from "./Histogram"
import { Stats } from "./Stats"


export const BandsStatistic = () => {
    const [img] = useOutletContext<any>()
    const [state, setState] = React.useState(img.statistic.band_stats[0])
    console.log('123 -> ', img.statistic.band_stats[0])

    if(img) return <div className='row justify-content-center'>
        <div className='col-12'>
            <div className='row justify-content-center'>
                <div className='col-6'>
                    <select className="form-select form-select-sm mt-2"
                    defaultValue={img.statistic.band_stats[0].band}
                    onChange={(e) => setState(img.statistic.band_stats.find((x: {band: string}) => x.band === e.target.value))}
                    >
                        {
                            img.statistic.band_stats.map((band: any, iter: number) => {
                                return <option
                                key={band.band}
                                value={band.band}
                                >{band.band}</option>
                            })
                        }
                    </select>
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='col-12'>
                    <Histogram band={state} />
                    <Stats band={state} />
                </div>
            </div>
        </div>
    </div>

    return <div></div>
}