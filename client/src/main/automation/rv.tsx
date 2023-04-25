import { makeVar } from "@apollo/client";

export const automationStep = makeVar(0)
export const algType = makeVar('monitoring' as 'monitoring' | 'dataProcessing')
export const algName = makeVar('')