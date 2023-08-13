import {
  useDraftPlot,
  useDraftPlotActions,
} from '@/store/draftPlot/draftPlotStore'
import { Point } from '@/store/draftPlot/common'
import isValidCoordinate from '@/store/draftPlot/isValidCoordinate'

const stopCaretJumpingToTheEnd = (
  target: EventTarget & HTMLInputElement,
  type: 'lat' | 'lng',
) => {
  const caret =
    target.selectionStart !== null && !isValidCoordinate(target.value, type)
      ? target.selectionStart - 1
      : target.selectionStart

  window.requestAnimationFrame(() => {
    // eslint-disable-next-line no-param-reassign
    target.selectionStart = caret
    // eslint-disable-next-line no-param-reassign
    target.selectionEnd = caret
  })
}

function PointInput({ point, type }: { point: Point; type: 'lat' | 'lng' }) {
  const { changePoint } = useDraftPlotActions()

  return (
    <td>
      <input
        value={point[type]}
        onChange={({ target }) => {
          changePoint({
            ...point,
            [type]: target.value,
          })

          stopCaretJumpingToTheEnd(target, type)
        }}
        type="text"
        className="input input-bordered input-xs w-full max-w-xs"
      />
    </td>
  )
}

function PlotCreatorRows() {
  const draftPlot = useDraftPlot()

  return (
    <>
      {draftPlot.map((point) => (
        <tr key={point.id}>
          <PointInput point={point} type="lng" />
          <PointInput point={point} type="lat" />
        </tr>
      ))}
    </>
  )
}

export default PlotCreatorRows
