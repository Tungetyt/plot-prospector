import userEvent from '@testing-library/user-event'
import customRender from '@/utils/customRender'
import en from '../../../messages/en.json'
import PlotInfoForm from './PlotInfoForm'

test('should update currency input', async () => {
  const { getByLabelText } = customRender(<PlotInfoForm email={null} />)
  const currencyInput = getByLabelText(en.Index.Plot_Price) as HTMLInputElement

  await userEvent.type(currencyInput, '123456')

  expect(currencyInput.value).toBe('$123,456')
})
