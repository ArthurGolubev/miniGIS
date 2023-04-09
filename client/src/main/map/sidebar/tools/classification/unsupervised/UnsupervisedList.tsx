import * as React from 'react'
import { useNavigate } from 'react-router'
import { Accordion } from 'react-bootstrap'
import { tools } from '../../../../rv'
import { useReactiveVar } from '@apollo/client'



export const UnsupervisedList = () => {
    const redirect = useNavigate()

    return <div className='row justify-content-center mt-3'>
        <div className='col-11'>
            <Accordion>
                
                {/* -------------------------------------------Kmean-Start------------------------------------------ */}
                <Accordion.Item eventKey='0'>
                    <Accordion.Header>KMean1</Accordion.Header>
                        <Accordion.Body>
                            <div className='row justify-content-center'>
                                <div className='col-12'>
                                    Алгоритм KMeans группирует данные, пытаясь разделить выборки на n групп с одинаковой дисперсией, сводя к минимуму критерий,
                                    известный как инерция или сумма квадратов внутри кластера (см. ниже). Этот алгоритм требует указания количества кластеров.
                                    Он хорошо масштабируется для большого количества образцов и используется в самых разных областях применения в самых
                                    разных областях.
                                </div>
                                <div className='row justify-content-end'>
                                    <div className='col-auto me-3'>
                                        <button
                                        onClick={()=>redirect('/classification/unsupervised/kmean')}
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
                        <div className='row justify-content-center'>
                            <div className='col-12'>
                                Это BisectingKMeans итеративный вариант KMeans, использующий разделительную иерархическую кластеризацию.
                                Вместо того, чтобы создавать все центроиды сразу, центроиды выбираются постепенно на основе предыдущей кластеризации:
                                кластер многократно разбивается на два новых кластера, пока не будет достигнуто целевое количество кластеров.
                                BisectingKMeans более эффективен, чем KMeans при большом количестве кластеров, поскольку он работает только с
                                подмножеством данных в каждом делении пополам, но KMeansвсегда работает со всем набором данных.
                                Этот вариант более эффективен для агломерационной кластеризации, если количество кластеров невелико
                                по сравнению с количеством точек данных.            
                            </div>
                            <div className='row justify-content-end'>
                                <div className='col-auto me-3'>
                                    <button
                                    onClick={()=>redirect('/classification/unsupervised/bisecting-kmean')}
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
                    <div className='row justify-content-center'>
                        <div className='col-12'>
                            Объект GaussianMixture реализует алгоритм максимизации ожидания (EM) для подгонки смешанных гауссовских моделей.
                            Он также может рисовать эллипсоиды достоверности для многомерных моделей и вычислять байесовский информационный
                            критерий для оценки количества кластеров в данных. GaussianMixture.fitПредоставляется метод, который изучает гауссовскую
                            модель смеси из данных поезда . Имея тестовые данные, он может присвоить каждой выборке гауссову диаграмму, которой она,
                            скорее всего, принадлежит, используя метод GaussianMixture.predict.
                            Поставляется GaussianMixtureс различными вариантами ограничения ковариации оцениваемых классов разности: сферическая,
                            диагональная, связанная или полная ковариация.            
                        </div>
                        <div className='row justify-content-end'>
                            <div className='col-auto me-3'>
                                <button
                                onClick={()=>redirect('/classification/unsupervised/gaussian-mixture')}
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
                        <div className='row justify-content-center'>
                            <div className='col-12'>
                                MeanShiftкластеризация направлена ​​на обнаружение пятен в равномерной плотности образцов.
                                Это алгоритм, основанный на центроидах, который работает путем обновления кандидатов на центроиды,
                                чтобы они были средним значением точек в заданной области. Затем эти кандидаты фильтруются на этапе постобработки,
                                чтобы исключить почти дубликаты и сформировать окончательный набор центроидов.            
                            </div>
                            <div className='row justify-content-end'>
                                <div className='col-auto me-3'>
                                    <button
                                    onClick={()=>redirect('/classification/unsupervised/mean-shift')}
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