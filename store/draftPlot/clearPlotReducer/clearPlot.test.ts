import clearPlotReducer from '@/store/draftPlot/clearPlotReducer/clearPlotReducer'
import { initialState, State } from '@/store/draftPlot/common'

describe('clearPlotReducer', () => {
  let mockState: State

  beforeEach(() => {
    mockState = {
      plot: [
        {
          id: '1',
          lat: 40.7128,
          lng: 74.006
        },
        {
          id: '2',
          lat: 34.0522,
          lng: 118.2437
        }
      ],
      phase: 'PLOT_CREATION'
    }
  })

  it('should return the initial state', () => {
    const result = clearPlotReducer()()
    expect(result).toEqual(initialState)
  })

  it('should reset the phase to an empty string', () => {
    const result = clearPlotReducer()()
    expect(result.phase).toBe('')
  })

  it('should reset the plot to its initial state', () => {
    const result = clearPlotReducer()()
    expect(result.plot).toEqual(initialState.plot)
  })

  it('should return a new state object', () => {
    const result = clearPlotReducer()()
    expect(result).not.toBe(mockState)
  })
})
