import * as React from 'react'
import { ToggleNavTabs } from '../ToggleNavTabs'
import { Outlet, useLocation } from 'react-router'
import { toolsDescription } from '../../../../analysis/stores/constants'



export const ShowSelectedTab = () => {

    let location = useLocation()
    
    return <div>
        <div className='row justify-content-center' style={{height: "100px"}}>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <figure>
                    <blockquote className="blockquote">
                        <p>
                            {location.pathname == '/main/map/workflow/poi' && toolsDescription.title.POI}
                            {location.pathname == '/main/map/workflow/clip' && toolsDescription.title.Clip}
                            {location.pathname == '/main/map/workflow/stack' && toolsDescription.title.Stack}
                            {location.pathname == '/main/map/workflow/classification' && toolsDescription.title.Classification}
                            {location.pathname == '/main/map/workflow/classification/unsupervised' && toolsDescription.title.Unsupervised}
                            {location.pathname == '/main/map/workflow/classification/supervised' && toolsDescription.title.Supervised}
                        </p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        {location.pathname == '/main/map/workflow/poi' && toolsDescription.description.POI}
                        {location.pathname == '/main/map/workflow/clip' && toolsDescription.description.Clip}
                        {location.pathname == '/main/map/workflow/stack' && toolsDescription.description.Stack}
                        {location.pathname == '/main/map/workflow/classification' && toolsDescription.description.Classification}
                        <span style={{fontSize: '80%'}}>{location.pathname == '/main/map/workflow/classification/unsupervised' && toolsDescription.description.Unsupervised}</span>
                        {location.pathname == '/main/map/workflow/classification/supervised' && toolsDescription.description.Supervised}
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