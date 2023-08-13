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

  it('should return an object with phase "INFORMATION_FORM" for an "INFORMATION_FORM" input', () => {
    const result = changePhaseReducer('INFORMATION_FORM')
    expect(result()).toEqual({ phase: 'INFORMATION_FORM' })
  })

  it('should return different phases for different inputs', () => {
    const result1 = changePhaseReducer('PLOT_CREATION')
    const result2 = changePhaseReducer('INFORMATION_FORM')
    expect(result1()).not.toEqual(result2())
  })
})
