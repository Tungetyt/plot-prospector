import userEvent from '@testing-library/user-event'
import customRender from '@/utils/customRender'
import { Email } from '@/utils/types'
import { screen, waitFor } from '@testing-library/react'
import { Index } from '../../../messages/en.json'
import PlotInfoForm from './PlotInfoForm'

describe('PlotInfoForm', () => {
  const renderComponent = (email: Email | null) =>
    customRender(<PlotInfoForm email={email} />)

  test('renders PlotInfoForm component', () => {
    renderComponent(null)
    expect(screen.getByRole('heading', { name: Index.Plot_Info })).toBeDefined()
  })

  test('fills out the form and submits', async () => {
    renderComponent('test@email.com')

    const description = screen.getByRole('textbox', {
      name: Index.Plot_Description
    }) as HTMLInputElement
    const address = screen.getByRole('textbox', {
      name: Index.Plot_Address
    }) as HTMLInputElement
    const email = screen.getByRole('textbox', {
      name: Index.Contact_Email
    }) as HTMLInputElement
    const tel = screen.getByRole('textbox', {
      name: Index.Contact_Phone
    }) as HTMLInputElement
    const currencyInput = screen.getByRole('textbox', {
      name: Index.Plot_Price
    }) as HTMLInputElement

    await userEvent.type(description, 'Test Description')
    await userEvent.type(address, 'Test Address')
    await userEvent.type(email, '123')
    await userEvent.type(tel, '1234567890')
    await userEvent.type(currencyInput, '123456')

    expect(description.value).toBe('Test Description')
    expect(address.value).toBe('Test Address')
    expect(email.value).toBe('test@email.com123')
    expect(tel.value).toBe('+1 234 567 890')
    expect(currencyInput.value).toBe('$123,456')
  })

  test('shows validation errors', () => {
    renderComponent(null)

    const email = screen.getByRole('textbox', { name: Index.Contact_Email })
    const tel = screen.getByRole('textbox', { name: Index.Contact_Phone })
    const submitButton = screen.getByRole('button', { name: Index.Finish })

    userEvent.clear(email)
    userEvent.type(email, 'invalidEmail')
    userEvent.type(tel, 'invalidPhone')
    userEvent.click(submitButton)

    waitFor(() => {
      screen.getByText(Index.Validation.Invalid_email)
      screen.getByText(Index.Validation.Invalid_phone)
    })
  })

  test('validates maximum price value', async () => {
    renderComponent(null)

    const priceInput = screen.getByRole('textbox', { name: Index.Plot_Price })
    const submitButton = screen.getByRole('button', { name: Index.Finish })

    await userEvent.type(priceInput, '1000000000001') // More than one trillion
    userEvent.click(submitButton)

    await screen.findByText(Index.Validation.Value_cannot_exceed, {
      exact: false
    })
  })
})
