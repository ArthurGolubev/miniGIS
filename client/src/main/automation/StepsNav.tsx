import * as React from "react"
import { Link } from "react-router-dom"
import { useCreateAlgorithm } from "../../analysis/stores/createAlgorithm"


export const StepsNav = () => {
    const step = useCreateAlgorithm(state => state.step)
    const setStep = useCreateAlgorithm(state => state.setStep)

    const stepActive = "breadcrumb-item active"
    const stepUnactive = "breadcrumb-item"

    return <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
            <li className={step == 0 ? stepActive: stepUnactive }>
                {step !== 0 ? <Link to={'/main/automation/step-0'} onClick={()=>setStep(0)}>Этап 0</Link> : `Этап ${step}`}
            </li>
            <li className={step == 1 ? stepActive: stepUnactive }>
                {step !== 1 ? <Link to={'/main/automation/step-1'} onClick={()=>setStep(1)}>Этап 1</Link> : `Этап ${step}`}
            </li>
            <li className={step == 2 ? stepActive: stepUnactive }>
                {step !== 2 ? <Link to={'/main/automation/step-2'} onClick={()=>setStep(2)}>Этап 2</Link> : `Этап ${step}` }
            </li>
            <li className={step == 3 ? stepActive: stepUnactive }>
                {step !== 3 ? <Link to={'/main/automation/step-3'} onClick={()=>setStep(3)}>Этап 3</Link> : `Этап ${step}` }
            </li>
        </ol>
    </nav>
}