import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { sidebar } from '../rv'
import { GeometryTable } from './clip/GeometryTable'
import { NavTabs } from './NavTabs'
import { SearchImages } from './POI/SearchImages'
import { Clip } from './clip/Clip'
import { Classification } from './classification/Classification'
import { Stack } from './stack/Stack'


export const Sidebar = () => {
    const sidebarSub = useReactiveVar(sidebar)



    return <div className='card overflow-hidden' style={{height: "100%"}}>
        
        <div className='row justify-content-center' style={{height: "100px"}}>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <figure>
                    <blockquote className="blockquote">
                        <p>
                            {sidebarSub.show == 'POI' && sidebarSub.title.POI}
                            {sidebarSub.show == 'Clip' && sidebarSub.title.Clip}
                            {sidebarSub.show == 'Stack' && sidebarSub.title.Stack}
                            {sidebarSub.show == 'Classification' && sidebarSub.title.Classification}
                        </p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        {sidebarSub.show == 'POI' && sidebarSub.description.POI}
                        {sidebarSub.show == 'Clip' && sidebarSub.description.Clip}
                        {sidebarSub.show == 'Stack' && sidebarSub.description.Stack}
                        {sidebarSub.show == 'Classification' && sidebarSub.description.Classification}
                    </figcaption>
                </figure>
            </div>
        </div>
        <NavTabs />
        {
            sidebarSub.show == 'POI' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <SearchImages />
                </div>
            </div>
        }
        {
            sidebarSub.show == 'Clip' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <Clip />
                </div>
            </div>
        }
        {
            sidebarSub.show == 'Stack' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <Stack />
                </div>
            </div>
        }
        {
            sidebarSub.show == 'Classification' &&
            <div className='row justify-content-center mt-2'>
                <div className='col-12'>
                    <Classification />
                </div>
            </div>
        }
    </div>
}