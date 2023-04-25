import * as React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Accordion } from 'react-bootstrap'
import { classificationDescription } from '../../../../rv'
import { useReactiveVar } from '@apollo/client'



export const UnsupervisedList = () => {
    const redirect = useNavigate()
    const location = useLocation()
    const classificationDescriptionSub = useReactiveVar(classificationDescription)

    const path = location.pathname == '/main/automation' ? '/main/automation' : '/classification/unsupervised'

    return <div className='row justify-content-center mt-3'>
        <div className='col-11'>
            <Accordion>
                
                {/* -------------------------------------------Kmean-Start------------------------------------------ */}
                <Accordion.Item eventKey='0'>
                    <Accordion.Header>KMean</Accordion.Header>
                        <Accordion.Body>
                            <div className='row justify-content-center overflow-auto' style={{maxHeight: "20vh"}}>
                                <div className='col-12' style={{fontSize: '80%'}}>
                                    {classificationDescriptionSub.unsupervised.KMean}
                                </div>
                                <div className='row justify-content-end'>
                                    <div className='col-auto me-3'>
                                        <button
                                        onClick={()=>redirect(`${path}/kmean`)}
                                        className='btn btn-sm btn-light'
                                        type='button'>
                                            Рассчитать <i className="bi bi-arrow-right link-dark"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Accordion.Body>
                </Accordion.Item>
                {/* -------------------------------------------Kmean-End-------------------------------------------- */}


                {/* -------------------------------------------Bisecting-KMean-Start------------------------------------------ */}
                <Accordion.Item eventKey='1'>
                    <Accordion.Header>Bisecting KMean</Accordion.Header>
                    <Accordion.Body>
                        <div className='row justify-content-center overflow-auto' style={{maxHeight: "20vh"}}>
                            <div className='col-12' style={{fontSize: '80%'}}>
                                {classificationDescriptionSub.unsupervised.BisectingKMean}
                            </div>
                            <div className='row justify-content-end'>
                                <div className='col-auto me-3'>
                                    <button
                                    onClick={()=>redirect(`${path}//bisecting-kmean`)}
                                    className='btn btn-sm btn-light'
                                    type='button'>
                                        Рассчитать <i className="bi bi-arrow-right link-dark"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                {/* -------------------------------------------Bisecting-KMean-End-------------------------------------------- */}


                {/* -------------------------------------------Gaussian-Mixture-Start------------------------------------------ */}
                <Accordion.Item eventKey='2'>
                    <Accordion.Header>Gaussian Mixture</Accordion.Header>
                    <Accordion.Body>
                    <div className='row justify-content-center overflow-auto' style={{maxHeight: "20vh"}}>
                        <div className='col-12' style={{fontSize: '80%'}}>
                            {classificationDescriptionSub.unsupervised.GaussianMixture}
                        </div>
                        <div className='row justify-content-end'>
                            <div className='col-auto me-3'>
                                <button
                                onClick={()=>redirect(`${path}/gaussian-mixture`)}
                                className='btn btn-sm btn-light'
                                type='button'>
                                    Рассчитать <i className="bi bi-arrow-right link-dark"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    </Accordion.Body>
                </Accordion.Item>
                {/* -------------------------------------------Gaussian-Mixture-End-------------------------------------------- */}


                {/* -------------------------------------------Mean-Shift-Start------------------------------------------ */}
                <Accordion.Item eventKey='3'>
                    <Accordion.Header>Mean Shift</Accordion.Header>
                    <Accordion.Body>
                        <div className='row justify-content-center overflow-auto' style={{maxHeight: "20vh"}}>
                            <div className='col-12' style={{fontSize: '80%'}}>
                                {classificationDescriptionSub.unsupervised.MeanShift}
                            </div>
                            <div className='row justify-content-end'>
                                <div className='col-auto me-3'>
                                    <button
                                    onClick={()=>redirect(`${path}/mean-shift`)}
                                    className='btn btn-sm btn-light'
                                    type='button'>
                                        Рассчитать <i className="bi bi-arrow-right link-dark"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                {/* -------------------------------------------Mean-Shift-End-------------------------------------------- */}

            </Accordion>
        </div>
    </div>
}