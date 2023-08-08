'use client'

import { useTranslations } from 'next-intl'
import CancelBtn from '@/app/components/CancelBtn'
import PlotCreatorRows from '@/app/components/PlotCreatorRows'
import {
  useDraftPlotActions,
  usePhase,
} from '@/app/store/draftPlot/draftPlotStore'

export type PlotCreationControllerState =
  | ''
  | 'PLOT_CREATION'
  | 'INFORMATION_FORM'

function PlotCreationController() {
  const t = useTranslations('Index')

  const phase = usePhase()
  const { changePhase } = useDraftPlotActions()

  const createdPointsCount = 0

  if (phase === 'PLOT_CREATION')
    return (
      <>
        <CancelBtn setState={changePhase} />
        <li className="mb-14">
          <button
            type="button"
            className="btn  btn-primary"
            onClick={() => changePhase('INFORMATION_FORM')}
            disabled={createdPointsCount < 2}
          >
            {t('Next')}
          </button>
        </li>

        <li className="overflow-x-auto max-h-96 px-1">
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
        </li>
      </>
    )

  if (phase === 'INFORMATION_FORM') return <CancelBtn setState={changePhase} />

  return (
    <li>
      <button
        type="button"
        onClick={() => changePhase('PLOT_CREATION')}
        className="btn btn-primary"
      >
        {t('Create_Plot')}
      </button>
    </li>
  )
}

export default PlotCreationController
