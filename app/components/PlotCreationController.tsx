'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import CancelBtn from '@/app/components/CancelBtn'
import PlotCreatorRows from '@/app/components/PlotCreatorRows'
import {
  useDraftPlot,
  useDraftPlotActions,
  usePhase,
} from '@/app/store/draftPlot/draftPlotStore'
import { Point } from '@/app/store/draftPlot/common'
import isNumeric from '@/app/utils/common'

export type PlotCreationControllerState =
  | ''
  | 'PLOT_CREATION'
  | 'INFORMATION_FORM'

const isCollinear = (p1: Point, p2: Point, p3: Point): boolean => {
  if (
    isNumeric(p1.lat) &&
    isNumeric(p1.lng) &&
    isNumeric(p2.lat) &&
    isNumeric(p2.lng) &&
    isNumeric(p3.lat) &&
    isNumeric(p3.lng)
  ) {
    const area =
      p1.lat * (p2.lng - p3.lng) +
      p2.lat * (p3.lng - p1.lng) +
      p3.lat * (p1.lng - p2.lng)
    return area === 0
  }

  return false
}

const isEmptyPoint = (point: Point): boolean => !point.lat && !point.lng

export const isPolygon = (draftPlot: ReadonlyArray<Point>): boolean => {
  if (draftPlot.length < 3) return false // Can't form a polygon with less than 3 points

  const lastPoint = draftPlot[draftPlot.length - 1]

  if (!lastPoint) throw new Error('Expected last point to be defined')

  const plot = isEmptyPoint(lastPoint) ? draftPlot.slice(0, -1) : draftPlot

  const hasInvalidPoint = plot.some(
    (point) => !(isNumeric(point.lat) && isNumeric(point.lng)),
  )
  if (hasInvalidPoint) return false

  const collinearFound = plot.slice(0, -2).some((_, i) => {
    const p1 = plot[i]
    const p2 = plot[i + 1]
    const p3 = plot[i + 2]

    if (!p1 || !p2 || !p3) throw new Error('Expected points to be defined')

    return isCollinear(p1, p2, p3)
  })

  return !collinearFound
}

function PlotCreationController() {
  const t = useTranslations('Index')

  const phase = usePhase()
  const draftPoints = useDraftPlot()
  const { changePhase } = useDraftPlotActions()
  const [showError, setShowError] = useState(false)

  if (phase === 'PLOT_CREATION')
    return (
      <>
        <CancelBtn setState={changePhase} />

        <li className="mb-14">
          <button
            type="button"
            className="btn  btn-primary"
            onClick={() => {
              if (isPolygon(draftPoints)) {
                setShowError(false)
                changePhase('INFORMATION_FORM')
                return
              }

              setShowError(true)
              setTimeout(() => setShowError(false), 1000)
            }}
          >
            {t('Next')}
          </button>
          {showError && (
            <div className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Invalid plot</span>
            </div>
          )}
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
