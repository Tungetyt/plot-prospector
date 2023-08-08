import { create } from 'zustand'
import {
  initialState,
  Phase,
  PointFromTextInput,
  Store,
} from '@/app/store/draftPlot/common'
import changePointReducer from '@/app/store/draftPlot/changePointReducer'
import storeActionsSelector from '@/app/utils/zustand'
import confirmPlotReducer from '@/app/store/draftPlot/confirmPlotReducer'
import changePhaseReducer from '@/app/store/draftPlot/changePhaseReducer'

const useDraftPlotStore = create<Store>((set) => ({
  ...initialState,
  actions: {
    changePoint: (updatedPoint: PointFromTextInput) =>
      set(changePointReducer(updatedPoint)),
    confirmPlot: () => set(confirmPlotReducer()),
    changePhase: (phase: Phase) => set(changePhaseReducer(phase)),
  },
}))

const draftPlotSelector = ({ plot }: Store) => plot
const phaseSelector = ({ phase }: Store) => phase
export const useDraftPlot = () => useDraftPlotStore(draftPlotSelector)
export const usePhase = () => useDraftPlotStore(phaseSelector)
export const useDraftPlotActions = () => useDraftPlotStore(storeActionsSelector)