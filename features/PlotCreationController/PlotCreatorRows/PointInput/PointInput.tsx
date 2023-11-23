import isValidCoordinate from '@/store/draftPlot/isValidCoordinate/isValidCoordinate'
import {Point} from '@/store/draftPlot/common'
import {useDraftPlotActions} from '@/store/draftPlot/draftPlotStore'

const stopCaretJumpingToTheEnd = (
  target: EventTarget & HTMLInputElement,
  type: 'lat' | 'lng'
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

function PointInput({point, type}: {point: Point; type: 'lat' | 'lng'}) {
  const {changePoint} = useDraftPlotActions()

  return (
    // eslint-disable-next-line jsx-a11y/control-has-associated-label
    <td>
      <input
        value={point[type]}
        onChange={({target}) => {
          changePoint({
            ...point,
            [type]: target.value
          })

          stopCaretJumpingToTheEnd(target, type)
        }}
        type="text"
        className="input input-bordered input-xs w-full max-w-xs"
      />
    </td>
  )
}

export default PointInput
