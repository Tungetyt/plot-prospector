'use client'

import { useTranslations } from 'next-intl'
import CancelBtn from '@/app/components/PlotCreationController/CancelBtn'
import PlotCreatorRows from '@/app/components/PlotCreationController/PlotCreatorRows'
import {
  useDraftPlotActions,
  usePhase,
} from '@/app/store/draftPlot/draftPlotStore'
import NextButton from '@/app/components/PlotCreationController/NextButton'

function PlotCreationController() {
  const t = useTranslations('Index')
  const phase = usePhase()
  const { changePhase } = useDraftPlotActions()

  if (phase === 'PLOT_CREATION')
    return (
      <>
        <CancelBtn setState={changePhase} />
        <NextButton />
        <div className="overflow-x-auto max-h-96 px-1">
          <table className="table table-xs table-fixed table-pin-rows">
            <thead>
              <tr>
                <th className="pl-4">{t('Longitude')}</th>
                <th className="pl-4">{t('Latitude')}</th>
              </tr>
            </thead>
            <tbody>
              <PlotCreatorRows />
            </tbody>
          </table>
        </div>
      </>
    )

  if (phase === 'INFORMATION_FORM') return <CancelBtn setState={changePhase} />

  return (
    <button
      type="button"
      onClick={() => changePhase('PLOT_CREATION')}
      className="btn btn-primary w-full"
    >
      {t('Create_Plot')}
    </button>
  )
}

export default PlotCreationController
