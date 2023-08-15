import { useTranslations } from 'next-intl'
import { createPortal } from 'react-dom'
import { useDraftPlotActions } from '@/store/draftPlot/draftPlotStore'
import { displayModal } from '@/utils/common'
import body from '@/utils/clientCommon'

const dialogId = 'cancelPlotModal'

function CancelButton() {
  if (!body) throw new Error('Expected body to be in DOM')

  const t = useTranslations('Index')
  const { changePhase, clearPlot } = useDraftPlotActions()

  return (
    <>
      <button
        type="button"
        className="btn btn-error text-center mb-2"
        onClick={() => displayModal(dialogId)}
      >
        {t('Cancel_Plot')}
      </button>
      {createPortal(
        <dialog id={dialogId} className="modal">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">{t('Cancel_Plot')}</h3>
            <p className="pt-4">{t('Cancel_Plot_desc')}</p>
            <p>{t('Cancel_Plot_desc2')}</p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                type="submit"
                onClick={() => {
                  changePhase('')
                  clearPlot()
                }}
              >
                {t('Proceed')}
              </button>
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button type="submit">close</button>
          </form>
        </dialog>,
        body,
      )}
    </>
  )
}

export default CancelButton
