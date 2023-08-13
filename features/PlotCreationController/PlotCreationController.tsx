'use client'

import { useTranslations } from 'next-intl'
import CancelButton from '@/features/PlotCreationController/CancelButton'
import PlotCreatorRows from '@/features/PlotCreationController/PlotCreatorRows'
import { useDraftPlotActions, usePhase } from '@/store/draftPlot/draftPlotStore'
import NextButton from '@/features/PlotCreationController/NextButton'

function PlotCreationController() {
  const t = useTranslations('Index')
  const phase = usePhase()
  const { changePhase } = useDraftPlotActions()

  if (phase === 'PLOT_CREATION')
    return (
      <>
        <CancelButton />
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

  if (phase === 'INFORMATION_FORM') return <CancelButton />

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
