import { create } from 'zustand'
import { storeActionsSelector } from '@/app/utils/zustand'
import {
  changePointReducer,
  initialState,
  Phase,
  PointFromTextInput,
  Store,
} from '@/app/store/draftPlot/changePointReducer'

const useDraftPlotStore = create<Store>((set) => ({
  ...initialState,
  actions: {
    changePoint: (updatedPoint: PointFromTextInput) =>
      set(changePointReducer(updatedPoint)),
    confirmPlot: () => set(() => initialState),
    changePhase: (phase: Phase) =>
      set(() => ({
        phase,
      })),
  },
}))

const draftPlotSelector = ({ plot }: Store) => plot
const phaseSelector = ({ phase }: Store) => phase
export const useDraftPlot = () => useDraftPlotStore(draftPlotSelector)
export const usePhase = () => useDraftPlotStore(phaseSelector)
export const useDraftPlotActions = () => useDraftPlotStore(storeActionsSelector)
