import {
  useDraftPlot,
  useDraftPlotActions,
} from '@/app/store/draftPlot/draftPlot'
import { isValidCoordinate } from '@/app/store/draftPlot/changePointReducer'

const stopCaretJumpingToTheEnd = (
  target: EventTarget & HTMLInputElement,
  type: 'lat' | 'lng',
) => {
  const caret =
    target.selectionStart !== null && !isValidCoordinate(target.value, type)
      ? target.selectionStart - 1
      : target.selectionStart

  const element = target
  window.requestAnimationFrame(() => {
    element.selectionStart = caret
    element.selectionEnd = caret
  })
}

// const PointInput = ({point, type}: {point: Point, type: 'lat' | 'lng'}) => {
//   const { changePoint } = useDraftPlotActions()
//
// return   <td>
//     <input
//         value={point.lat}
//         onChange={({ target }) => {
//           changePoint({
//             ...point,
//             lat: target.value,
//           })
//
//           stopCaretJumpingToTheEnd(target, type)
//         }}
//         type="text"
//         className="input input-bordered input-xs w-full max-w-xs"
//     />
//   </td>
// }

const PlotCreatorRows = () => {
  const draftPlot = useDraftPlot()
  const { changePoint } = useDraftPlotActions()

  return (
    <>
      {draftPlot.map((point) => (
        <tr key={point.id}>
          <td>
            <input
              value={point.lng}
              onChange={({ target }) => {
                // TODO: Refactor this to accept kind: 'latitude' | 'longitude' and use the same reducer
                changePoint({
                  ...point,
                  lng: target.value,
                })

                stopCaretJumpingToTheEnd(target, 'lng')
              }}
              className="input input-bordered input-xs w-full max-w-xs"
            />
          </td>
          <td>
            <input
              value={point.lat}
              onChange={({ target }) => {
                changePoint({
                  ...point,
                  lat: target.value,
                })

                stopCaretJumpingToTheEnd(target, 'lat')
              }}
              type="text"
              className="input input-bordered input-xs w-full max-w-xs"
            />
          </td>
        </tr>
      ))}
    </>
  )
}

export default PlotCreatorRows
