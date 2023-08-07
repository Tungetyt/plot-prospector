import {
  useDraftPlot,
  useDraftPlotActions,
} from '@/app/store/draftPlot/draftPlot'

const PlotCreatorRows = () => {
  const draftPlot = useDraftPlot()
  const { changePoint } = useDraftPlotActions()

  return (
    <>
      {draftPlot.map(({ id, coords }) => (
        <tr key={id}>
          <td>
            <input
              value={coords[0]}
              onChange={({ target }) =>
                changePoint({
                  id,
                  coords: [target.value, coords[1]],
                })
              }
              type="text"
              className="input input-bordered input-xs w-full max-w-xs"
            />
          </td>
          <td>
            <input
              value={coords[1]}
              onChange={({ target }) =>
                // TODO: Refactor this to accept kind: 'latitude' | 'longitude' and use the same reducer
                changePoint({
                  id,
                  coords: [coords[0], target.value],
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
