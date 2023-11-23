import PlotInfoForm from '@/features/PlotCreationController/PlotInfoForm/PlotInfoForm'
import useBody from '@/utils/useBody'
import {createPortal} from 'react-dom'
import {Email} from '@/utils/types'
import {plotInfoFormDialogId} from '@/features/PlotCreationController/NextButtonWithWarning/NextButton'

export type PlotInfoFormModalProps = {email: Email | null}

function PlotInfoFormModal({email}: PlotInfoFormModalProps) {
  const body = useBody()

  return (
    <>
      {body &&
        createPortal(
          <dialog id={plotInfoFormDialogId} className="modal">
            <PlotInfoForm email={email} />
          </dialog>,
          body
        )}
    </>
  )
}

export default PlotInfoFormModal
