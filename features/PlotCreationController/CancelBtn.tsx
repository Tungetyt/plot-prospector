import { useTranslations } from 'next-intl'
import { createPortal } from 'react-dom'
import { Store } from '@/store/draftPlot/common'

const dialogId = 'cancelPlotModal'
const body = document.getElementsByTagName('body')[0]

function CancelBtn({
  setState,
}: {
  setState: Store['actions']['changePhase']
}) {
  const t = useTranslations('Index')

  if (!body) throw new Error('Expected body to be in DOM')

  return (
    <>
      <button
        type="button"
        className="btn btn-error text-center mb-2"
        onClick={() =>
          (
            window as Window &
              typeof globalThis & {
                [dialogId]: {
                  showModal: () => void
                }
              }
          )[dialogId].showModal()
        }
      >
        {t('Cancel_Plot')}
      </button>
      {createPortal(
        <dialog id={dialogId} className="modal">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">{t('Cancel_Plot')}</h3>
            <p className="pt-4">{t('Cancel_Plot_desc')}</p>
            <p className="pb-4">{t('Cancel_Plot_desc2')}</p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                type="submit"
                onClick={() => setState('')}
              >
                {t('Cancel_Plot')}
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

export default CancelBtn
