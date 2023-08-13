import { initialState } from '@/store/draftPlot/common'
import clearPlotReducer from '@/store/draftPlot/clearPlotReducer'

describe('clearPlotReducer', () => {
  it('should reset the state back to initial state', () => {
    const newState = clearPlotReducer()()
    expect(newState).toEqual(initialState)
  })

  it('should reset a non-empty phase back to an empty string', () => {
    const newState = clearPlotReducer()()
    expect(newState.phase).toEqual('')
  })

  it('should reset plot points back to the initial state', () => {
    const newState = clearPlotReducer()()
    expect(newState.plot.length).toEqual(1)
    expect(newState.plot[0]!.lat).toEqual(initialState.plot[0]!.lat)
    expect(newState.plot[0]!.lng).toEqual(initialState.plot[0]!.lng)
  })

  it('should return a state with an id for the plot point', () => {
    const newState = clearPlotReducer()()
    expect(newState.plot[0]!.id).toBeDefined()
  })
})
