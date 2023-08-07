import {
  useDraftPlot,
  useDraftPlotActions,
} from '@/app/store/draftPlot/draftPlot'
import { isValidCoordinate } from '@/app/store/draftPlot/changePointReducer'

const stopCaretJumpingToTheEnd = (target: EventTarget & HTMLInputElement) => {
  const caret =
    target.selectionStart !== null &&
    !isValidCoordinate(target.value, 'longitude')
      ? target.selectionStart - 1
      : target.selectionStart

  const element = target
  window.requestAnimationFrame(() => {
    element.selectionStart = caret
    element.selectionEnd = caret
  })
}

const PlotCreatorRows = () => {
  const draftPlot = useDraftPlot()
  const { changePoint } = useDraftPlotActions()

  return (
    <>
      {draftPlot.map((point) => (
        <tr key={point.id}>
          <td>
            <input
              value={point.x}
              onChange={({ target }) => {
                changePoint({
                  ...point,
                  x: target.value,
                })

                stopCaretJumpingToTheEnd(target)
              }}
              type="text"
              className="input input-bordered input-xs w-full max-w-xs"
            />
          </td>
          <td>
            <input
              value={point.y}
              onChange={({ target }) => {
                // TODO: Refactor this to accept kind: 'latitude' | 'longitude' and use the same reducer
                changePoint({
                  ...point,
                  y: target.value,
                })

                stopCaretJumpingToTheEnd(target)
              }}
              className="input input-bordered input-xs w-full max-w-xs"
            />
          </td>
        </tr>
      ))}
    </>
  )
}

export default PlotCreatorRows
