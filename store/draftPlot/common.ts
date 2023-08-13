type Coord = number | '' | `${number}.` | '-'

export interface Point {
  id: string
  lat: Coord
  lng: Coord
}

export type PointFromTextInput = Pick<Point, 'id'> & {
  lat: number | string
  lng: number | string
}

export type Phase = '' | 'PLOT_CREATION' | 'INFORMATION_FORM'

export interface Store {
  plot: ReadonlyArray<Point>
  phase: Phase
  actions: {
    changePoint: (updatedPoint: PointFromTextInput) => void
    clearPlot: () => void
    changePhase: (phase: Phase) => void
  }
}

export type State = Readonly<Omit<Store, 'actions'>>

export const initialCoord = ''

export const initialState: State = {
  plot: [
    {
      id: crypto.randomUUID(),
      lat: initialCoord,
      lng: initialCoord,
    },
  ],
  phase: '',
} as const
