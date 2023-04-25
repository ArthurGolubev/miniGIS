import * as React from 'react'
import { createHashRouter, createBrowserRouter } from "react-router-dom";
import { YandexAuthorization } from "./profile/YandexAuthorization"
import { KMean } from "./main/map/sidebar/tools/classification/unsupervised/KMean"
import { SearchImages } from "./main/map/sidebar/tools/POI/SearchImages"
import { Clip } from "./main/map/sidebar/tools/clip/Clip"
import { Stack } from "./main/map/sidebar/tools/stack/Stack"
import { SelectClassificationType } from "./main/map/sidebar/tools/classification/SelectClassificationType"
import { Authorization } from "./profile/Authorization"
import { App } from './app/App'
import { ErrorPage } from './ErrorPage'
import { Main } from "./main/Main"
import { Registration } from "./profile/Registration"
import { UnsupervisedList } from './main/map/sidebar/tools/classification/unsupervised/UnsupervisedList';
import { BisectingKMean } from './main/map/sidebar/tools/classification/unsupervised/BisectingKMean';
import { GaussianMixture } from './main/map/sidebar/tools/classification/unsupervised/GaussianMixture';
import { MeanShift } from './main/map/sidebar/tools/classification/unsupervised/MeanShift';
import { Map } from './main/map/Map';
import { Automation } from './main/automation/Automation';
import { Step1 } from './main/automation/Step1';
import { Step2 } from './main/automation/Step2';
import { Step3 } from './main/automation/Step3';
import { Step0 } from './main/automation/Step0';
import { ShowSelectedTab } from './main/map/sidebar/tools/ShowSelectedTab';
import { ViewSidebar } from './main/map/sidebar/layers/ViewSidebar';


export const router = createHashRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: 'main',
                element: <Main />,
                children: [
                    {
                        path: 'automation',
                        element: <Automation />,
                        children: [
                            {
                                path: 'step-0',
                                element: <Step0 />
                            },
                            {
                                path: 'step-1',
                                element: <Step1 />,
                            },
                            {
                                path: 'step-2',
                                element: <Step2 />
                            },
                            {
                                path: 'step-3',
                                element: <Step3 />
                            },
                        ]
                    },
                    {
                        path: 'map',
                        element: <Map />,
                        children: [
                            {
                                path: 'workflow',
                                element: <ShowSelectedTab />,
                                children: [
                                    {
                                        path: 'poi',
                                        element: <SearchImages />
                                    },
                                    {
                                        path: 'clip',
                                        element: <Clip />
                                    },
                                    {
                                        path: 'stack',
                                        element: <Stack />
                                    },
                                    {
                                        path: 'classification',
                                        element: <SelectClassificationType />,
                                    },
                                    {
                                        path: 'classification/unsupervised',
                                        element: <UnsupervisedList />,
                                    },
                                    {
                                        path: 'classification/supervised',
                                    }
                                ]
                            },
                            {
                                path: 'layers',
                                element: <ViewSidebar />,
                                
                            }
                        ]
                    }
                ]
            },
            
            {
                path: '/classification/unsupervised/kmean',
                element: <KMean />
            },
            {
                path: '/classification/unsupervised/bisecting-kmean',
                element: <BisectingKMean />
            },
            {
                path: '/classification/unsupervised/gaussian-mixture',
                element: <GaussianMixture />
            },
            {
                path: '/classification/unsupervised/mean-shift',
                element: <MeanShift />
            },

            {
                path: 'home',
                element: <div>Hello world!</div>
            },
            {
                path: 'registration',
                element: <Registration />
            },
            {
                path: 'authorization',
                element: <Authorization />
            },
            {
                path: 'yandex-authorization',
                element: <YandexAuthorization />
            },
        ]
    },
])