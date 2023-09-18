import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'
import { Step2 } from './Step2'
import { Step3 } from './Step3'


describe('Test <Step2 />', () => {
    const user = userEvent.setup()
    beforeEach(() => {
        useCreateAlgorithm.setState(state => ({...state, step: 2}))
        return render(
            <MemoryRouter initialEntries={['/main/automation/step-2', '/main/automation/step-3']} initialIndex={0}>
                <Routes>
                    <Route path='/main/automation/step-2' element={<Step2 />} />
                    <Route path='/main/automation/step-3' element={<Step3 />} />
                </Routes>
            </MemoryRouter>
        )
    })    

    test('title on page', () => {
        const title = screen.getByText('Область работы')
        expect(title).toBeInTheDocument()
    })
    test('ClipBtn component on page', () => {
        const ClipBtn = screen.getByTestId('ClipBtn')
        expect(ClipBtn).toBeInTheDocument()
    })
    test('click next step', async () => {
        const nextBtn = screen.getByTestId('step2-next-btn')

        expect(useCreateAlgorithm.getState().step).toBe(2)

        await user.click(nextBtn)
        const nextStepTitile = screen.getByText('Алгоритм классификации')
        expect(nextStepTitile).toBeInTheDocument()

        expect(useCreateAlgorithm.getState().step).toBe(3)
    })
})