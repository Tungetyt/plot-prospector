import plotInfoFormDTOSchema, {
  PlotInfoFormData,
} from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema'

const model: PlotInfoFormData = {
  description: '',
  address: '',
  price: { value: undefined, currency: 'PLN' },
  email: '',
  tel: '',
}

let mockedData: typeof model

describe('plotInfoFormDTOSchema', () => {
  beforeEach(() => {
    mockedData = structuredClone(model)
  })

  it('validates description correctly', () => {
    mockedData.description = 'This is a description'
    const validDescription = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(validDescription.success).toBe(true)

    mockedData.description = '     '
    const invalidDescription = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(invalidDescription.success).toBe(true)
  })

  it('validates address correctly', () => {
    mockedData.address = '123 Main St'
    const validAddress = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(validAddress.success).toBe(true)

    mockedData.address = '    '
    const invalidAddress = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(invalidAddress.success).toBe(true)
  })

  it('validates price correctly', () => {
    mockedData.price = { value: '20.5', currency: 'USD' }
    const validPrice = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(validPrice.success).toBe(true)

    mockedData.price = { value: '20.555', currency: 'USD' }
    const invalidPrice = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(invalidPrice.success).toBe(false)

    mockedData.price = { value: '12345678901234', currency: 'USD' }
    const tooBigValue = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(tooBigValue.success).toBe(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedData.price = { value: '20.5', currency: 'NonExistentCurrency' as any }
    const badCurrencyValue = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(badCurrencyValue.success).toBe(false)
  })

  it('validates email correctly', () => {
    mockedData.email = 'test@example.com'
    const validEmail = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(validEmail.success).toBe(true)

    mockedData.email = 'invalid-email'
    const invalidEmail = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(invalidEmail.success).toBe(false)
  })

  it('validates tel correctly', () => {
    const germanTel = '+491522343333'
    mockedData.tel = germanTel
    const validTel = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(validTel.success).toBe(true)

    mockedData.tel = '+1234567890'
    const invalidTel = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(invalidTel.success).toBe(false)

    mockedData.tel = 'invalid-number'
    const invalidTel2 = plotInfoFormDTOSchema.safeParse(mockedData)
    expect(invalidTel2.success).toBe(false)
  })
})
