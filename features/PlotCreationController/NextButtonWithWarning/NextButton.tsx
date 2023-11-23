import isPolygon from '@/features/PlotCreationController/NextButtonWithWarning/isPolygon/isPolygon'
import {Dispatch, SetStateAction, useRef} from 'react'
import {useDraftPlot} from '@/store/draftPlot/draftPlotStore'
import {useTranslations} from 'next-intl'
import {showModal} from '@/utils/modal'

export const plotInfoFormDialogId = 'infoFormModal'

function NextButton({
  setShowWarning
}: {
  setShowWarning: Dispatch<SetStateAction<boolean>>
}) {
  const t = useTranslations('Index')
  const draftPoints = useDraftPlot()
  const timerId = useRef<NodeJS.Timeout | undefined>(undefined)

  return (
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
  )
}

export default NextButton
