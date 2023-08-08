import { Phase } from '@/app/store/draftPlot/common'

const changePhaseReducer = (phase: Phase) => () => ({
  phase,
})

export default changePhaseReducer
