import '@testing-library/jest-dom'
import { act, render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { CreateAutomationBtn } from './CreateAutomationBtn'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'
import { useSearchImages } from '../../analysis/stores/searchImages'
import { useClassificationConfig } from '../../analysis/stores/classificationConfig'
import { useClipMask } from '../../analysis/stores/clipMask'
import { useImagesStack } from '../../analysis/stores/imagesStack'
import { useToasts } from '../../interface/stores/Toasts'

jest.mock('../../app/socket', () => ({
    socket: {
        emit: () => jest.fn()
    }
}))


describe('Test <CreateAutomationBtn />', () => {
    beforeEach(() => render(<CreateAutomationBtn />))
    // afterEach(() => useToasts.setState(state => ({...state, toasts: undefined}) ))
    const user = userEvent.setup()
    test('empty fields', async () => {
        let btn = screen.getByTestId('create-automation-btn')
        await user.click(btn)
        expect(Object.keys(useToasts.getState().toasts).length).toBe(1)
        // let toasts = useToasts.getState().toasts
        // Object.keys(toasts).map(key => console.log(toasts[key]))
    })
    test('ok fields', async () => {
        act(() => {
            useCreateAlgorithm.setState(state => ({
                ...state,
                algName: 'algName test',
                algType: 'algType test',
            }))
            useClassificationConfig.setState(state => ({
                ...state,
                classes: 15,
                method: 'KMean test'
            }))
            useClipMask.setState(state => ({
                ...state,
                mask: {},
            }))
            useImagesStack.setState(state => ({
                ...state,
                sentinel: {
                    sentinel: {
                        meta: {
                            bands: ['b4', 'b3']
                        }
                    }
                }
            }))
            useSearchImages.setState(state => ({
                ...state,
                sensor: 'S2',
                startDate: new Date(),
                endDate: new Date(),
                poi: [1, 2]
            }))

        })
        let btn = screen.getByTestId('create-automation-btn')
        await user.click(btn)
        let toasts = useToasts.getState().toasts
        // Object.keys(toasts).map(key => console.log(toasts[key]))
        expect(Object.keys(toasts).keys.length).toBe(0)
    })
})