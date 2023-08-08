import { Phase } from '@/app/store/draftPlot/common'

export const changePhaseReducer = (phase: Phase) => {
  return () => ({
    phase,
  })
}
