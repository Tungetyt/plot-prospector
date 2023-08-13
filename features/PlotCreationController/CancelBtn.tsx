import { useTranslations } from 'next-intl'
import { Store } from '@/store/draftPlot/common'

function CancelBtn({
  setState,
}: {
  setState: Store['actions']['changePhase']
}) {
  const t = useTranslations('Index')
  return (
    <button
      type="button"
      className="btn  btn-error text-center"
      onClick={() => setState('')}
    >
      {t('Cancel_Plot')}
    </button>
  )
}

export default CancelBtn
