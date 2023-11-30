import useBody from '@/utils/useBody'
import {createPortal} from 'react-dom'
import {Email} from '@/utils/types'
import {propertyFormDialogId} from '@/features/PlotCreationController/NextButtonWithWarning/NextButton'
import PropertyForm from './Property/PropertyForm'

export type PropertyFormModalProps = {email: Email | null}

function PropertyFormModal({email}: PropertyFormModalProps) {
  const body = useBody()

  return (
    <>
      {body &&
        createPortal(
          <dialog id={propertyFormDialogId} className="modal">
            <PropertyForm email={email} />
          </dialog>,
          body
        )}
    </>
  )
}

export default PropertyFormModal
