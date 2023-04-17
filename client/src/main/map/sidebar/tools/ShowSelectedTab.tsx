import * as React from 'react'
import { ToggleNavTabs } from '../ToggleNavTabs'
import { SearchImages } from './POI/SearchImages'
import { Clip } from './clip/Clip'
import { SelectClassificationType } from './classification/SelectClassificationType'
import { Stack } from './stack/Stack'
import { tools } from '../../rv'
import { useReactiveVar } from '@apollo/client'
import { UnsupervisedList } from './classification/unsupervised/UnsupervisedList'
import { SupervisedList } from './classification/supervised/SupervisedList'
import { Outlet, useLocation } from 'react-router'


export const ShowSelectedTab = () => {
    const toolsSub = useReactiveVar(tools)
    let location = useLocation()
    
    return <div>
        <div className='row justify-content-center' style={{height: "100px"}}>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <figure>
                    <blockquote className="blockquote">
                        <p>
                            {location.pathname == '/main/poi' && toolsSub.title.POI}
                            {location.pathname == '/main/clip' && toolsSub.title.Clip}
                            {location.pathname == '/main/stack' && toolsSub.title.Stack}
                            {location.pathname == '/main/classification' && toolsSub.title.Classification}
                            {location.pathname == '/main/classification/unsupervised' && toolsSub.title.Unsupervised}
                            {location.pathname == '/main/classification/supervised' && toolsSub.title.Supervised}
                        </p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        {location.pathname == '/main/poi' && toolsSub.description.POI}
                        {location.pathname == '/main/clip' && toolsSub.description.Clip}
                        {location.pathname == '/main/stack' && toolsSub.description.Stack}
                        {location.pathname == '/main/classification' && toolsSub.description.Classification}
                        <span style={{fontSize: '80%'}}>{location.pathname == '/main/classification/unsupervised' && toolsSub.description.Unsupervised}</span>
                        {location.pathname == '/main/classification/supervised' && toolsSub.description.Supervised}
                    </figcaption>
                </figure>
            </div>
        </div>
        <ToggleNavTabs />
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <Outlet />
                </div>
            </div>
    </div>
}