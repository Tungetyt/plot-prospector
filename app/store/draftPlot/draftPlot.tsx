import { create } from 'zustand'
import { storeActionsSelector } from '@/app/utils/zustand'
import {
  changePointReducer,
  initialState,
  PointFromTextInput,
  Store,
} from '@/app/store/draftPlot/changePointReducer'

const useDraftPlotStore = create<Store>((set) => ({
  ...initialState,
  actions: {
    changePoint: (updatedPoint: PointFromTextInput) =>
      set(changePointReducer(updatedPoint)),
    confirmPlot: () => set(() => initialState),
  },
}))

const draftPlotSelector = ({ plot }: Store) => plot
export const useDraftPlot = () => useDraftPlotStore(draftPlotSelector)
export const useDraftPlotActions = () => useDraftPlotStore(storeActionsSelector)
