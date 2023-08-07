import {
  useDraftPlot,
  useDraftPlotActions,
} from '@/app/store/draftPlot/draftPlot'

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
              onChange={({ target }) =>
                changePoint({
                  ...point,
                  x: target.value,
                })
              }
              type="text"
              className="input input-bordered input-xs w-full max-w-xs"
            />
          </td>
          <td>
            <input
              value={point.y}
              onChange={({ target }) =>
                // TODO: Refactor this to accept kind: 'latitude' | 'longitude' and use the same reducer
                changePoint({
                  ...point,
                  y: target.value,
                })
              }
              className="input input-bordered input-xs w-full max-w-xs"
            />
          </td>
        </tr>
      ))}
    </>
  )
}

export default PlotCreatorRows
