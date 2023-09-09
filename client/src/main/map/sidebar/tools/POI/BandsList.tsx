import * as React from 'react'
import { bands } from "../../../../../analysis/stores/constants"
import { useSearchImages } from "../../../../../analysis/stores/searchImages"
import { LandsatType, SentinelType, useImagesStack } from "../../../../../analysis/stores/imagesStack"
import { useSelectedImage } from "../../../../../analysis/stores/selectedImage"


export const BandsList = () => {

    const sensor = useSearchImages(state => state.sensor)
    const sentinel = useImagesStack(state => state.sentinel)
    const landsat = useImagesStack(state => state.landsat)
    const imagesStack = useImagesStack(state => state)
    const setImagesStack = useImagesStack(state => state.setImagesStack)
    const metadata = useSelectedImage(state => state.metadata)

    const bandsHandler = (isChecked: boolean, band: string | Array<string>) => {
        let satellite: "sentinel" | "landsat"
        let date
        let exist
        let bands
        let info

        if(sensor === 'S2'){
            // SENTINEL
            satellite = 'sentinel'
            date = new Date(metadata.GENERATION_TIME).toISOString().slice(0, 10)
            exist = !!sentinel?.[date]
            info = {
                mgrsTile: metadata.MGRS_TILE,
                productId: metadata.PRODUCT_ID,
                granuleId: metadata.GRANULE_ID,
                bands: []
            }
        } else {
            // LANDSAT
            satellite = 'landsat'
            date = metadata.DATE_ACQUIRED
            exist = !!landsat?.[date]
            info = {
                sensorId: sensor,
                path: String(metadata.WRS_PATH),
                row: String(metadata.WRS_ROW),
                productId: metadata.LANDSAT_PRODUCT_ID,
                bands: []
            }
        }

        if (typeof(band) == "string"){
            if(exist){
                // если такой объект уже существеут, то взять его бенды
                bands = imagesStack[satellite][date].meta.bands
                // добавить или убрать слой
                isChecked ? bands.push(band) : bands = bands.filter(b => b != band)
                // обновить банды
                info.bands = bands
            } else {
                // если нету, то создать
                info.bands = [band,]
            }
        } else {
            info.bands = band
            band.forEach(check => (document.querySelector(`#band-${check}`) as HTMLInputElement).checked = true)
        }
        console.log('info -> ', info)
        setImagesStack({
            [satellite]: {
                ...imagesStack[satellite],
                [date]: {
                    meta: {
                        ...info
                    },
                    status: 'wait'
                }
            }
        } as SentinelType | LandsatType)
    }



    const getSattelliteBands = () => {
        switch (sensor) {
            case 'S2':
                console.log('S2')
                return bands.sentinel2
            case 'LC09':
                console.log('LC09')
                return bands.landsat8and9
            case 'LC08':
                console.log('LC08')
                return bands.landsat8and9
            case 'LC07':
                console.log('LC07')
                return bands.landsat7
            case 'LC05':
                console.log('LC05')
                return bands.landsat4and5
            case 'LC04':
                console.log('LC04')
                return bands.landsat4and5
            default:
                console.log('DEFAULT case from Metadata.tsx')
                break;
        }
    }


    return <div className='row justify-content-center'>
        <div className='col-12'>
            
            <div className='row justify-content-center'>
                {
                    getSattelliteBands().map((band: string, iter: number) => {
                        return <div className='col-4' key={iter}>
                            <div className="form-check form-check-inline">
                                <input className='form-check-input' type={"checkbox"} id={`band-${band}`} defaultChecked={false}
                                    onChange={e => bandsHandler(e.target.checked, band) }
                                />
                                <label className='form-check-label' htmlFor={"band-" + band}>{band}</label>
                            </div>
                        </div>
                    })
                }
            </div>
            
            <div className='row justify-content-center'>
                <div className='col-4'>
                    <button onClick={()=>bandsHandler(true, getSattelliteBands())} className='btn btn-sm btn-success' type='button'>Выбрать все</button>
                </div>
            </div>

        </div>
    </div>

}