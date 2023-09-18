import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { useCreateAlgorithm } from '../../analysis/stores/createAlgorithm'
import { Step3 } from './Step3'
import { userEvent } from '@testing-library/user-event'
import { useClassificationConfig } from '../../analysis/stores/classificationConfig'
import { classificationDescription } from '../../analysis/stores/constants'



describe('Test <Step3 />', () => {
    let Select
    const user = userEvent.setup()
    beforeEach(() => {
        useCreateAlgorithm.setState(state => ({...state, step: 3}))
        render(
            <MemoryRouter initialEntries={['/main/automation/step-3']} initialIndex={0}>
                <Routes>
                    <Route path='/main/automation/step-3' element={<Step3 />} />
                </Routes>
            </MemoryRouter>
        )
        Select = screen.getByTestId('select-method-classification')
    })    
    test('title on page', () => expect(screen.getByText('Алгоритм классификации')).toBeInTheDocument() )
    test('SelectAlgorithmMethod component on page', () => expect(screen.getByTestId('SelectAlgorithmMethod')).toBeInTheDocument() )
    test('CreateAutomationBtn component on page', () => expect(screen.getByTestId('CreateAutomationBtn')).toBeInTheDocument() )
    test('Select Default', () => {
        expect(useClassificationConfig.getState().method).toBe('KMean')
        expect(screen.getByTestId('classification-description').textContent).toBe(classificationDescription.unsupervised.KMean)
    })
    test('Select BisectingKMean', async () => {
        await user.selectOptions(Select, 'BisectingKMean')
        expect(screen.getByTestId('classification-description').textContent).toBe(classificationDescription.unsupervised.BisectingKMean)
        expect(useClassificationConfig.getState().method).toBe('BisectingKMean')
    })
    test('Select BisectingKMean', async () => {
        await user.selectOptions(Select, 'GaussianMixture')
        expect(screen.getByTestId('classification-description').textContent).toBe(classificationDescription.unsupervised.GaussianMixture)
        expect(useClassificationConfig.getState().method).toBe('GaussianMixture')
    })
    test('Select MeanShift', async () => {
        await user.selectOptions(Select, 'MeanShift')
        expect(screen.getByTestId('classification-description').textContent).toBe(classificationDescription.unsupervised.MeanShift)
        expect(useClassificationConfig.getState().method).toBe('MeanShift')
    })
})
