'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import CancelBtn from '@/app/components/CancelBtn'
import PlotCreatorRows from '@/app/components/PlotCreatorRows'

export type PlotCreationControllerState =
  | ''
  | 'PLOT_CREATION'
  | 'INFORMATION_FORM'

const PlotCreationController = () => {
  const t = useTranslations('Index')

  const [state, setState] = useState<PlotCreationControllerState>('')

  const createdPointsCount = 0

  if (state === 'PLOT_CREATION')
    return (
      <>
        <CancelBtn setState={setState} />
        <li className="mb-14">
          <button
            className="btn  btn-primary"
            onClick={() => setState('INFORMATION_FORM')}
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

  if (state === 'INFORMATION_FORM') return <CancelBtn setState={setState} />

  return (
    <li>
      <button
        onClick={() => setState('PLOT_CREATION')}
        className="btn btn-primary"
      >
        {t('Create_Plot')}
      </button>
    </li>
  )
}

export default PlotCreationController
