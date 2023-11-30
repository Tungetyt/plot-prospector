import userEvent from '@testing-library/user-event'
import customRender from '@/utils/customRender'
import {Email} from '@/utils/types'
import {act, screen, waitFor} from '@testing-library/react'
import {Index} from '../../../messages/en.json'
import PropertyForm from './PropertyForm'

describe('PropertyForm', () => {
  const renderComponent = (email: Email | null) =>
    customRender(<PropertyForm email={email} />)

  test('shows validation errors', async () => {
    renderComponent(null)

    const email = screen.getByRole('textbox', {name: Index.Contact_Email})
    const tel = screen.getByRole('textbox', {name: Index.Contact_Phone})
    const submitButton = screen.getByRole('button', {name: Index.Finish})

    await waitFor(async () => {
      await userEvent.clear(email)
      await userEvent.type(email, 'invalidEmail')
      await userEvent.type(tel, 'invalidPhone')
      await userEvent.click(submitButton)
    })

    await waitFor(async () => {
      act(async () => {
        await screen.findByText(Index.Validation.Invalid_email)
        await screen.findByText(Index.Validation.Invalid_phone)
      })
    })
  })
})
