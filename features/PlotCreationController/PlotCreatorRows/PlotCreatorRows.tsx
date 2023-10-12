import { useDraftPlot } from '@/store/draftPlot/draftPlotStore'
import PointInput from '@/features/PlotCreationController/PlotCreatorRows/PointInput'

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
