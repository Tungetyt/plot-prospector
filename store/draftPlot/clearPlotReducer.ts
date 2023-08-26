import { initialState, State } from '@/store/draftPlot/common'

const clearPlotReducer = () => (): State => ({
  ...initialState,
  phase: '',
})

export default clearPlotReducer
