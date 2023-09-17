// import * as React from 'react'
import { screen, render, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, RouterProvider, Routes, createMemoryRouter } from 'react-router-dom'
import { Step0 } from './Step0'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'
import { Step1 } from './Step1'

jest.mock("axios")
jest.mock('../map/sidebar/tools/POI/SearchImages', () => ({
    SearchImages: () => <div data-testid="SearchImagesMock"/>
    })
)
// Depricated
// const mockedUsedNavigate = jest.fn()
// jest.mock("react-router-dom", () => ({
//     ...(jest.requireActual("react-router-dom")),
//     useNavigate: () => mockedUsedNavigate
// }))


describe('Test <Step0 />', () => {
    const user = userEvent.setup()
    beforeEach(() => render(
        <MemoryRouter initialEntries={["/main/automation/step-0", "/main/automation/step-1"]} initialIndex={0}>
            <Routes>
                <Route path="/main/automation/step-0" element={<Step0 />} />
                <Route path="/main/automation/step-1" element={<Step1 />} />
            </Routes>
        </MemoryRouter>
    ))

    

    test('title on the page', async () => {
        let title = await screen.findByText('Тип алгоритма')
        expect(title).toBeInTheDocument()
    })
    test('algorithmn name input', async () => {
        const algorithNameInput = screen.getByTestId('algorithm name input')
        const algorithmName = "Особый алгоритм для поиска изменений в лесной экосистеме восточной Сибири"

        expect(algorithNameInput).toHaveValue('')
        
        await user.type(algorithNameInput, algorithmName)
        expect(algorithNameInput).toHaveValue(algorithmName)
        expect(useCreateAlgorithm.getState().algName).toBe(algorithmName)
    })
    test('change algorithm type', async () => {
        const radioDataProcessing = screen.getByTestId('radio check dataProcessing')
        const radioMonitoring = screen.getByTestId('radio check monitoring')

        expect(useCreateAlgorithm.getState().algType).toBe(undefined)
        
        await user.click(radioDataProcessing)
        expect(radioDataProcessing).toBeChecked(true)
        expect(useCreateAlgorithm.getState().algType).toBe('dataProcessing')

        await user.click(radioMonitoring)
        expect(radioMonitoring).toBeChecked(true)
        expect(useCreateAlgorithm.getState().algType).toBe('monitoring')
    })
    test('click next Step', async () => {
        const nextBtn = screen.getByTestId('next-btn')
                
        expect(useCreateAlgorithm.getState().step).toBe(0)
        
        await user.click(nextBtn)

        expect(useCreateAlgorithm.getState().step).toBe(1)
        let title = await screen.findByText('Выбор слоёв')
        expect(title).toBeInTheDocument()

    })
})