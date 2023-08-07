'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  useDraftPlot,
  useDraftPlotActions,
} from '@/app/store/draftPlot/draftPlot'

type State = '' | 'PLOT_CREATION' | 'INFORMATION_FORM'

const CancelBtn = ({
  setState,
}: {
  setState: Dispatch<SetStateAction<State>>
}) => {
  const t = useTranslations('Index')
  return (
    <li>
      <button
        className="btn  btn-error text-center"
        onClick={() => setState('')}
      >
        {t('Cancel_Plot')}
      </button>
    </li>
  )
}

const PlotCreationController = () => {
  const t = useTranslations('Index')

  const [state, setState] = useState<State>('')

  const draftPlot = useDraftPlot()
  const { changePoint } = useDraftPlotActions()
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
