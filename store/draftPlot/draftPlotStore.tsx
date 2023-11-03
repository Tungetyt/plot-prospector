import { create } from 'zustand'
import {
  initialState,
  Phase,
  PointFromTextInput,
  Store
} from '@/store/draftPlot/common'
import changePointReducer from '@/store/draftPlot/changePointReducer/changePointReducer'
import storeActionsSelector from '@/utils/zustand'
import clearPlotReducer from '@/store/draftPlot/clearPlotReducer/clearPlotReducer'
import changePhaseReducer from '@/store/draftPlot/changePhaseReducer/changePhaseReducer'

const useDraftPlotStore = create<Store>((set) => ({
  ...initialState,
  actions: {
    changePoint: (updatedPoint: PointFromTextInput) =>
      set(changePointReducer(updatedPoint)),
    clearPlot: () => set(clearPlotReducer()),
    changePhase: (phase: Phase) => set(changePhaseReducer(phase))
  }
}))

const draftPlotSelector = ({ plot }: Store) => plot
const phaseSelector = ({ phase }: Store) => phase
export const useDraftPlot = () => useDraftPlotStore(draftPlotSelector)
export const usePhase = () => useDraftPlotStore(phaseSelector)
export const useDraftPlotActions = () => useDraftPlotStore(storeActionsSelector)
