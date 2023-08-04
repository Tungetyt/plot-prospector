'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslations } from 'next-intl'

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

  const createdPointsCount = 0

  // TODO: Every point should have an id
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [points, setPoints] = useState<[number, number][]>([
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9, 10],
    [11, 12],
    [13, 14],
    [15, 16],
    [17, 18],
    [19, 20],
    [21, 22],
    [23, 24],
    [25, 26],
    [27, 28],
    [29, 30],
    [31, 32],
    [33, 34],
    [35, 36],
    [37, 38],
    [39, 40],
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9, 10],
    [11, 12],
    [13, 14],
    [15, 16],
    [17, 18],
    [19, 20],
    [21, 22],
    [23, 24],
    [25, 26],
    [27, 28],
    [29, 30],
    [31, 32],
    [33, 34],
    [35, 36],
    [37, 38],
    [39, 40],
  ])

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

        <li className="overflow-x-auto max-h-96">
          <table className="table table-xs table-fixed table-pin-rows">
            <thead>
              <tr>
                <th>{t('Longitude')}</th>
                <th className="w-1"></th>
                <th>{t('Latitude')}</th>
              </tr>
            </thead>
            <tbody>
              {points.map(([x, y]) => (
                // TODO: Every point should have an id
                // eslint-disable-next-line
                <tr>
                  <td className="px-0">
                    <input
                      value={x}
                      type="text"
                      className="input input-bordered input-xs w-full max-w-xs"
                    />
                  </td>
                  <td className="w-1"></td>
                  <td className="px-0">
                    <input
                      value={y}
                      type="text"
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
