import '@testing-library/jest-dom'
import { userEvent } from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'


jest.mock('../map/sidebar/tools/POI/SearchImages', () => ({
    SearchImages: () => <div data-testid="SearchImagesMock"/>
    })
)


describe('Test <Step1 />', () => {
    const user = userEvent.setup()
    beforeEach(() => {
        useCreateAlgorithm.setState(state => ({...state, step: 1}))
        return render(
            <MemoryRouter initialEntries={['/main/automation/step-1', '/main/automation/step-2']} initialIndex={0}>
                <Routes>
                    <Route path='/main/automation/step-1' element={<Step1 />} />
                    <Route path='/main/automation/step-2' element={<Step2 />} />
                </Routes>
            </MemoryRouter>
        )
    })    

    test('title on page', () => {
        const title = screen.getByText('Выбор слоёв')
        expect(title).toBeInTheDocument()
    })
    test('SearchImages component on page', () => {
        const SearchImages = screen.getByTestId('SearchImagesMock')
        expect(SearchImages).toBeInTheDocument()
    })
    test('click next step', async () => {
        const nextBtn = screen.getByTestId('step1-next-btn')

        expect(useCreateAlgorithm.getState().step).toBe(1)

        await user.click(nextBtn)
        const nextStepTitile = screen.getByText('Область работы')
        expect(nextStepTitile).toBeInTheDocument()

        expect(useCreateAlgorithm.getState().step).toBe(2)
    })
})