import create from 'zustand'
import { storeActionsSelector } from '@/app/utils/zustand'
import { immer } from 'zustand/middleware/immer'

interface Point {
  id: string
  point: [number, number]
}

interface IStore {
  plot: ReadonlyArray<Point>
  actions: {
    addPoint: (newPoint: Point) => void
    removePoint: (id: Point['id']) => void
    changePoint: (updatedPoint: Point) => void
    confirmPlot: () => void
  }
}

const initialState: Readonly<Omit<IStore, 'actions'>> = {
  plot: [],
} as const

const useDraftPlotStore = create(
  immer<IStore>((set): IStore => {
    return {
      ...initialState,
      actions: {
        addPoint: (newPoint: Point) =>
          set((draft) => {
            draft.plot.push(newPoint)
          }),
        removePoint: (id: Point['id']) =>
          set((draft) => {
            const index = draft.plot.findIndex((point) => point.id === id)
            if (index === -1) {
              //TODO: Send log to server
              console.error('Expected point to be found.')
              return
            }

            draft.plot.splice(index, 1)
          }),
        changePoint: (updatedPoint: Point) =>
          set((draft) => {
            const pointToChange = draft.plot.find(
              (point) => point.id === updatedPoint.id,
            )
            if (!pointToChange) {
              //TODO: Send log to server
              console.error('Expected point to be found.')
              return
            }

            pointToChange.point = updatedPoint.point
          }),
        confirmPlot: () => set(() => initialState),
      },
    }
  }),
)

const draftPlotSelector = ({ plot }: IStore) => plot
export const useDraftPlot = () => useDraftPlotStore(draftPlotSelector)
export const useDraftPlotActions = () => useDraftPlotStore(storeActionsSelector)
