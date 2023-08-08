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

export type State = Readonly<Omit<Store, 'actions'>>

export interface Store {
  plot: ReadonlyArray<Point>
  phase: Phase
  actions: {
    changePoint: (updatedPoint: PointFromTextInput) => void
    confirmPlot: () => void
    changePhase: (phase: Phase) => void
  }
}

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
