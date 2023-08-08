import {
  useDraftPlot,
  useDraftPlotActions,
} from '@/app/store/draftPlot/draftPlot'
import { isValidCoordinate } from '@/app/store/draftPlot/isValidCoordinate'
import { Point } from '@/app/store/draftPlot/common'

const stopCaretJumpingToTheEnd = (
  target: EventTarget & HTMLInputElement,
  type: 'lat' | 'lng',
) => {
  const caret =
    target.selectionStart !== null && !isValidCoordinate(target.value, type)
      ? target.selectionStart - 1
      : target.selectionStart

  window.requestAnimationFrame(() => {
    target.selectionStart = caret
    target.selectionEnd = caret
  })
}

const PointInput = ({ point, type }: { point: Point; type: 'lat' | 'lng' }) => {
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

const PlotCreatorRows = () => {
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
