import { useReactiveVar } from "@apollo/client"
import { bands, imagesStack, searchImages, selectedImage } from "../../../rv"
import * as React from 'react'


export const BandsList = () => {
    const selectedImageSub  = useReactiveVar(selectedImage)
    const searchImagesSub   = useReactiveVar(searchImages)
    const imagesStackSub    = useReactiveVar(imagesStack)

    const bandsHandler = (isChecked: boolean, band: string | Array<string>) => {
        let satellite: "sentinel" | "landsat"
        let date
        let exist
        let bands
        let info

        if(searchImagesSub.sensor === 'S2'){
            // SENTINEL
            satellite = 'sentinel'
            date = new Date(selectedImageSub.metadata.GENERATION_TIME).toISOString().slice(0, 10)
            exist = !!imagesStackSub.sentinel?.[date]
            info = {
                mgrsTile: selectedImageSub.metadata.MGRS_TILE,
                productId: selectedImageSub.metadata.PRODUCT_ID,
                granuleId: selectedImageSub.metadata.GRANULE_ID,
                bands: []
            }
        } else {
            // LANDSAT
            satellite = 'landsat'
            date = selectedImageSub.metadata.DATE_ACQUIRED
            exist = !!imagesStackSub.landsat?.[date]
            info = {
                sensorId: searchImagesSub.sensor,
                path: String(selectedImageSub.metadata.WRS_PATH),
                row: String(selectedImageSub.metadata.WRS_ROW),
                productId: selectedImageSub.metadata.LANDSAT_PRODUCT_ID,
                bands: []
            }
        }

        if (typeof(band) == "string"){
            if(exist){
                // если такой объект уже существеут, то взять его бенды
                bands = imagesStackSub[satellite][date].meta.bands
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
        
        imagesStack({
            ...imagesStackSub,
            [satellite]: {
                ...imagesStackSub[satellite],
                [date]: {
                    meta: {
                        ...info
                    },
                    status: 'wait'
                }
            }
        })
    }



    const getSattelliteBands = () => {
        console.log('searchImagesSub.sensor ->', searchImagesSub.sensor)
        switch (searchImagesSub.sensor) {
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