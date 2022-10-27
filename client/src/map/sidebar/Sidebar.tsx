import { useReactiveVar } from '@apollo/client'
import * as React from 'react'
import { sidebar } from '../rv'
import { GeometryTable } from './GeometryTable'
import { NavTabs } from './NavTabs'
import { SearchImages } from './SearchImages'


export const Sidebar = () => {
    const sidebarSub = useReactiveVar(sidebar)


    return <div className='card' style={{height: "100%"}}>
        
        <div className='row justify-content-center' style={{height: "100px"}}>
            <div className='col-12 mt-2 mb-2 ms-2'>
                <figure>
                    <blockquote className="blockquote">
                        <p>
                            {sidebarSub.show == 'POI' && sidebarSub.title.POI}
                            {sidebarSub.show == 'Crop' && sidebarSub.title.Crop}
                        </p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                        {sidebarSub.show == 'POI' && sidebarSub.description.POI}
                        {sidebarSub.show == 'Crop' && sidebarSub.description.Crop}
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
        {/* <div className='row justify-content-center'>
            <div className='col-12'>
                <GeometryTable />
            </div>
        </div> */}
    </div>
}