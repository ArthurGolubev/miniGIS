import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent, { UserEvent } from '@testing-library/user-event'
import { SelectAlgorithmMethod } from './SelectAlgorithmMethod'
import { useClassificationConfig } from '../../analysis/stores/classificationConfig'


describe('Testing <SelecteAlgorithmMethod />', () => {
    const user = userEvent.setup()

    describe('testing Default KMean', () => {
        let Input
        beforeEach(() => {
            render(<SelectAlgorithmMethod />)
            Input = screen.getByTestId('KMean input')
        })
        test('KMean is selected', () => expect(useClassificationConfig.getState().method).toBe('KMean') )
        test('more then max', async () => {
            let max = parseInt(Input.max)
            await user.type(Input, (max + 1).toString())
            expect(Input.value).toBe(Input.max)
            expect(useClassificationConfig.getState().classes).toBe(max)
        })
        test('max', async () => {
            await user.type(Input, Input.max)
            expect(Input.value).toBe(Input.max)
            expect(useClassificationConfig.getState().classes).toBe(parseInt(Input.max))
        })
        test('less then min', async () => {
            let min = parseInt(Input.min)
            await user.type(Input, (min - 1).toString())
            expect(Input.value).toBe(Input.min)
            expect(useClassificationConfig.getState().classes).toBe(min)
        })
        test('min', async () => {
            await user.type(Input, Input.min)
            expect(Input.value).toBe(Input.min)
            expect(useClassificationConfig.getState().classes).toBe(parseInt(Input.min))
        })
        test('ok value', async () => {
            let okValue = parseInt(Input.max) - parseInt(Input.min)
            await user.type(Input, okValue.toString())
            expect(Input.value).toBe(okValue.toString())
            expect(useClassificationConfig.getState().classes).toBe(okValue)
        })
    })

    describe('testing BisectingKMean', () => {
        let Input
        beforeEach(() => {
            useClassificationConfig.setState(state => ({...state, method: 'BisectingKMean'}))
            render(<SelectAlgorithmMethod />)
            Input = screen.getByTestId('BisectingKMean input')
        })
        test('BisectingKMean is selected', () => expect(useClassificationConfig.getState().method).toBe('BisectingKMean') )
        test('more then max', async () => {
            let max = parseInt(Input.max)
            await user.type(Input, (max + 1).toString())
            expect(Input.value).toBe(Input.max)
            expect(useClassificationConfig.getState().classes).toBe(max)
        })
        test('max', async () => {
            await user.type(Input, Input.max)
            expect(Input.value).toBe(Input.max)
            expect(useClassificationConfig.getState().classes).toBe(parseInt(Input.max))
        })
        test('less then min', async () => {
            let min = parseInt(Input.min)
            await user.type(Input, (min - 1).toString())
            expect(Input.value).toBe(Input.min)
            expect(useClassificationConfig.getState().classes).toBe(min)
        })
        test('min', async () => {
            await user.type(Input, Input.min)
            expect(Input.value).toBe(Input.min)
            expect(useClassificationConfig.getState().classes).toBe(parseInt(Input.min))
        })
        test('ok value', async () => {
            let okValue = parseInt(Input.max) - parseInt(Input.min)
            await user.type(Input, okValue.toString())
            expect(Input.value).toBe(okValue.toString())
            expect(useClassificationConfig.getState().classes).toBe(okValue)
        })
    })

    describe('testing GaussianMixture', () => {
        let Input
        beforeEach(() => {
            useClassificationConfig.setState(state => ({...state, method: 'GaussianMixture'}))
            render(<SelectAlgorithmMethod />)
            Input = screen.getByTestId('GaussianMixture input')
        })
        test('GaussianMixture is selected', () => expect(useClassificationConfig.getState().method).toBe('GaussianMixture') )
        test('more then max', async () => {
            let max = parseInt(Input.max)
            await user.type(Input, (max + 1).toString())
            expect(Input.value).toBe(Input.max)
            expect(useClassificationConfig.getState().classes).toBe(max)
        })
        test('max', async () => {
            await user.type(Input, Input.max)
            expect(Input.value).toBe(Input.max)
            expect(useClassificationConfig.getState().classes).toBe(parseInt(Input.max))
        })
        test('less then min', async () => {
            let min = parseInt(Input.min)
            await user.type(Input, (min - 1).toString())
            expect(Input.value).toBe(Input.min)
            expect(useClassificationConfig.getState().classes).toBe(min)
        })
        test('min', async () => {
            await user.type(Input, Input.min)
            expect(Input.value).toBe(Input.min)
            expect(useClassificationConfig.getState().classes).toBe(parseInt(Input.min))
        })
        test('ok value', async () => {
            let okValue = parseInt(Input.max) - parseInt(Input.min)
            await user.type(Input, okValue.toString())
            expect(Input.value).toBe(okValue.toString())
            expect(useClassificationConfig.getState().classes).toBe(okValue)
        })
    })

    describe('testing MeanShift', () => {
        let Input
        beforeEach(() => {
            useClassificationConfig.setState(state => ({...state, method: 'MeanShift'}))
            render(<SelectAlgorithmMethod />)
            Input = screen.getByTestId('MeanShift input')
        })
        test('MeanShift is selected', () => expect(useClassificationConfig.getState().method).toBe('MeanShift') )
        test('more then max', async () => {
            let max = parseInt(Input.max)
            await user.type(Input, (max + 1).toString())
            expect(Input.value).toBe(Input.max)
            expect(useClassificationConfig.getState().classes).toBe(max)
        })
        test('max', async () => {
            await user.type(Input, Input.max)
            expect(Input.value).toBe(Input.max)
            expect(useClassificationConfig.getState().classes).toBe(parseInt(Input.max))
        })
        test('less then min', async () => {
            let min = parseInt(Input.min)
            await user.type(Input, (min - 1).toString())
            expect(Input.value).toBe(Input.min)
            expect(useClassificationConfig.getState().classes).toBe(min)
        })
        test('min', async () => {
            await user.type(Input, Input.min)
            expect(Input.value).toBe(Input.min)
            expect(useClassificationConfig.getState().classes).toBe(parseInt(Input.min))
        })
        test('ok value', async () => {
            let okValue = parseInt(Input.max) - parseInt(Input.min)
            await user.type(Input, okValue.toString())
            expect(Input.value).toBe(okValue.toString())
            expect(useClassificationConfig.getState().classes).toBe(okValue)
        })
    })
})