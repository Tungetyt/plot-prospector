import changePhaseReducer from '@/store/draftPlot/changePhaseReducer'

describe('changePhaseReducer', () => {
  it('should return an object with an empty phase for an empty phase input', () => {
    const result = changePhaseReducer('')
    expect(result()).toEqual({ phase: '' })
  })

  it('should return an object with phase "PLOT_CREATION" for a "PLOT_CREATION" input', () => {
    const result = changePhaseReducer('PLOT_CREATION')
    expect(result()).toEqual({ phase: 'PLOT_CREATION' })
  })
})
