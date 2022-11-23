import * as React from 'react'
import { GeometryTable } from '../tools/clip/GeometryTable'
import { NavTabs } from '../NavTabs'
import { SearchImages } from '../tools/POI/SearchImages'
import { Clip } from '../tools/clip/Clip'
import { Classification } from '../tools/classification/Classification'
import { Stack } from '../tools/stack/Stack'
import { View } from '../tools/view/View'
import { tools } from '../../rv'
import { useReactiveVar } from '@apollo/client'


export const Tools = () => {
    const toolsSub = useReactiveVar(tools)
    
    return <div>
        <div className='row justify-content-center' style={{height: "100px"}}>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <figure>
                    <blockquote className="blockquote">
                        <p>
                            {toolsSub.show == 'POI' && toolsSub.title.POI}
                            {toolsSub.show == 'Clip' && toolsSub.title.Clip}
                            {toolsSub.show == 'Stack' && toolsSub.title.Stack}
                            {toolsSub.show == 'Classification' && toolsSub.title.Classification}
                        </p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        {toolsSub.show == 'POI' && toolsSub.description.POI}
                        {toolsSub.show == 'Clip' && toolsSub.description.Clip}
                        {toolsSub.show == 'Stack' && toolsSub.description.Stack}
                        {toolsSub.show == 'Classification' && toolsSub.description.Classification}
                    </figcaption>
                </figure>
            </div>
        </div>
        <NavTabs />
        {
            toolsSub.show == 'POI' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <SearchImages />
                </div>
            </div>
        }
        {
            toolsSub.show == 'Clip' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <Clip />
                </div>
            </div>
        }
        {
            toolsSub.show == 'Stack' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <Stack />
                </div>
            </div>
        }
        {
            toolsSub.show == 'Classification' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <Classification />
                </div>
            </div>
        }
        {
            toolsSub.show == 'Open' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <View />
                </div>
            </div>
        }
    </div>
}