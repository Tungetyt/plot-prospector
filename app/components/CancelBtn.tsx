import { useTranslations } from 'next-intl'
import { Store } from '@/app/store/draftPlot/common'

const CancelBtn = ({
  setState,
}: {
  setState: Store['actions']['changePhase']
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

export default CancelBtn
