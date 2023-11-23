'use client'

import {useTranslations} from 'next-intl'
import CancelButton from '@/features/PlotCreationController/CancelButton'
import PlotCreatorRows from '@/features/PlotCreationController/PlotCreatorRows/PlotCreatorRows'
import {useDraftPlotActions, usePhase} from '@/store/draftPlot/draftPlotStore'
import NextButtonWithWarning from '@/features/PlotCreationController/NextButtonWithWarning/NextButtonWithWarning'
import PlotInfoFormModal, {
  PlotInfoFormModalProps
} from '@/features/PlotCreationController/PlotInfoFormModal'

function PlotCreationController({email}: PlotInfoFormModalProps) {
  const t = useTranslations('Index')
  const phase = usePhase()
  const {changePhase} = useDraftPlotActions()

  if (phase === 'PLOT_CREATION')
    return (
      <>
        <CancelButton />
        <div className="overflow-x-auto max-h-96 px-1 mb-2">
          <table className="table table-xs table-fixed table-pin-rows">
            <thead>
              <tr>
                <th className="pl-4">{t('Latitude')}</th>
                <th className="pl-4">{t('Longitude')}</th>
              </tr>
            </thead>
            <tbody>
              <PlotCreatorRows />
            </tbody>
          </table>
        </div>
        <NextButtonWithWarning />
        <PlotInfoFormModal email={email} />
      </>
    )

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
