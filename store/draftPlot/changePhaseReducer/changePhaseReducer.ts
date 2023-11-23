import {Phase} from '@/store/draftPlot/common'

const changePhaseReducer = (phase: Phase) => () => ({
  phase
})

export default changePhaseReducer
