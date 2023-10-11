import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useDraftPlot } from '@/store/draftPlot/draftPlotStore'
import { showModal } from '@/utils/common'
import isPolygon from '@/features/PlotCreationController/NextButton/isPolygon'

export const plotInfoFormDialogId = 'infoFormModal'

function NextButton() {
  const [showWarning, setShowWarning] = useState(false)
  const draftPoints = useDraftPlot()
  const t = useTranslations('Index')
  const timerId = useRef<NodeJS.Timeout | undefined>(undefined)

  return (
    <>
      <button
        type="button"
        className="btn btn-primary w-full"
        onClick={() => {
          if (isPolygon(draftPoints)) {
            setShowWarning(false)
            showModal(plotInfoFormDialogId)
            return
          }

          setShowWarning(true)
          clearTimeout(timerId.current)
          timerId.current = setTimeout(() => setShowWarning(false), 1000)
        }}
      >
        {t('Next')}
      </button>
      <div className="h-20">
        {showWarning && (
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
            <span>{t('Invalid_plot')}</span>
          </div>
        )}
      </div>
    </>
  )
}

export default NextButton
