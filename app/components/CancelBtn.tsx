import { Dispatch, SetStateAction } from 'react'
import { useTranslations } from 'next-intl'
import { PlotCreationControllerState } from '@/app/components/PlotCreationController'

const CancelBtn = ({
  setState,
}: {
  setState: Dispatch<SetStateAction<PlotCreationControllerState>>
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
