import { useReactiveVar } from "@apollo/client"
import * as React from "react"
import { Link } from "react-router-dom"
import { automationStep } from "./rv"


export const StepsNav = () => {
    const stepSub = useReactiveVar(automationStep)

    const stepActive = "breadcrumb-item active"
    const stepUnactive = "breadcrumb-item"

    return <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
            <li className={stepSub == 1 ? stepActive: stepUnactive }>
                {stepSub !== 0 ? <Link to={'/main/automation/step-0'} onClick={()=>automationStep(0)}>Этап 0</Link> : `Этап ${stepSub}`}
            </li>
            <li className={stepSub == 1 ? stepActive: stepUnactive }>
                {stepSub !== 1 ? <Link to={'/main/automation/step-1'} onClick={()=>automationStep(1)}>Этап 1</Link> : `Этап ${stepSub}`}
            </li>
            <li className={stepSub == 2 ? stepActive: stepUnactive }>
                {stepSub !== 2 ? <Link to={'/main/automation/step-2'} onClick={()=>automationStep(2)}>Этап 2</Link> : `Этап ${stepSub}` }
            </li>
            <li className={stepSub == 3 ? stepActive: stepUnactive }>
                {stepSub !== 3 ? <Link to={'/main/automation/step-3'} onClick={()=>automationStep(3)}>Этап 3</Link> : `Этап ${stepSub}` }
            </li>
        </ol>
    </nav>
}