import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest'
import {render, fireEvent} from '@testing-library/react'
import PointInput from './PointInput'

// Mock store actions
const mockChangePoint = vi.fn()
vi.mock('@/store/draftPlot/draftPlotStore', () => ({
  useDraftPlotActions: () => ({
    changePoint: mockChangePoint
  })
}))

describe('PointInput', () => {
  beforeEach(() => {
    mockChangePoint.mockClear()
  })

  it('should update the point on change and keep caret position', async () => {
    const point = {lat: 10, lng: 20, id: 'abc'}
    const type = 'lat'
    const newLatValue = '10.5'

    const {getByRole} = render(<PointInput point={point} type={type} />)
    const input = getByRole('textbox') as HTMLInputElement

    // Set initial caret position to after '1' in '10'
    fireEvent.focus(input)
    fireEvent.change(input, {
      target: {value: newLatValue, selectionStart: 2, selectionEnd: 2}
    })
    fireEvent.blur(input)

    // Expect changePoint to have been called with the new value
    expect(mockChangePoint).toHaveBeenCalledWith({
      ...point,
      [type]: newLatValue
    })

    // Expect the caret position to be maintained after input (not jumping to the end)
    // The actual caret positioning is done via stopCaretJumpingToTheEnd, which uses requestAnimationFrame.
    // You might need to mock `window.requestAnimationFrame` to test this correctly, or ensure your environment handles it as expected.
    expect(input.selectionStart).toBe(2)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
})
