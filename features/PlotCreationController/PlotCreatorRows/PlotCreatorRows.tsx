import { useDraftPlot } from '@/store/draftPlot/draftPlotStore'
import PointInput from '@/features/PlotCreationController/PlotCreatorRows/PointInput/PointInput'

function PlotCreatorRows() {
  const draftPlot = useDraftPlot()

  return (
    <>
      {draftPlot.map((point) => (
        <tr key={point.id}>
          <PointInput point={point} type="lat" />
          <PointInput point={point} type="lng" />
        </tr>
      ))}
    </>
  )
}

export default PlotCreatorRows
