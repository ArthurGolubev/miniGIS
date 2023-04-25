import * as React from 'react'
import { ToggleNavTabs } from '../ToggleNavTabs'
import { tools } from '../../rv'
import { useReactiveVar } from '@apollo/client'
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
                            {location.pathname == '/main/map/workflow/poi' && toolsSub.title.POI}
                            {location.pathname == '/main/map/workflow/clip' && toolsSub.title.Clip}
                            {location.pathname == '/main/map/workflow/stack' && toolsSub.title.Stack}
                            {location.pathname == '/main/map/workflow/classification' && toolsSub.title.Classification}
                            {location.pathname == '/main/map/workflow/classification/unsupervised' && toolsSub.title.Unsupervised}
                            {location.pathname == '/main/map/workflow/classification/supervised' && toolsSub.title.Supervised}
                        </p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        {location.pathname == '/main/map/workflow/poi' && toolsSub.description.POI}
                        {location.pathname == '/main/map/workflow/clip' && toolsSub.description.Clip}
                        {location.pathname == '/main/map/workflow/stack' && toolsSub.description.Stack}
                        {location.pathname == '/main/map/workflow/classification' && toolsSub.description.Classification}
                        <span style={{fontSize: '80%'}}>{location.pathname == '/main/map/workflow/classification/unsupervised' && toolsSub.description.Unsupervised}</span>
                        {location.pathname == '/main/map/workflow/classification/supervised' && toolsSub.description.Supervised}
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