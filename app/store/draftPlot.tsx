import create from 'zustand'
import { storeActionsSelector } from '@/app/utils/zustand'
import {
  changePointReducer,
  initialState,
  Point,
  Store,
} from '@/app/store/changePointReducer'

const useDraftPlotStore = create<Store>((set) => ({
  ...initialState,
  actions: {
    changePoint: (updatedPoint: Point) => {
      set(changePointReducer(updatedPoint))
    },
    confirmPlot: () => set(() => initialState),
  },
}))

const draftPlotSelector = ({ plot }: Store) => plot
export const useDraftPlot = () => useDraftPlotStore(draftPlotSelector)
export const useDraftPlotActions = () => useDraftPlotStore(storeActionsSelector)
