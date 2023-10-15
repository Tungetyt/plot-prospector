import plotInfoFormDTOSchema from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema'

const mockData = {
  description: '',
  address: '',
  price: { value: undefined, currency: 'PLN' },
  email: '',
  tel: '',
} as const

describe('plotInfoFormDTOSchema', () => {
  it('validates description correctly', () => {
    const validDescription = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      description: 'This is a description',
    })
    expect(validDescription.success).toBe(true)

    const invalidDescription = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      description: '     ',
    })
    expect(invalidDescription.success).toBe(true)
  })

  it('validates address correctly', () => {
    const validAddress = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      address: '123 Main St',
    })
    expect(validAddress.success).toBe(true)

    const invalidAddress = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      address: '    ',
    })
    expect(invalidAddress.success).toBe(true)
  })

  it('validates price correctly', () => {
    const validPrice = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      price: { value: 20.5, currency: 'USD' },
    })
    expect(validPrice.success).toBe(true)

    const invalidPrice = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      price: { value: 20.555, currency: 'USD' },
    })
    expect(invalidPrice.success).toBe(false)

    const missingValue = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      price: { currency: 'USD' },
    })
    expect(missingValue.success).toBe(true)
  })

  it('validates email correctly', () => {
    const validEmail = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      email: 'test@example.com',
    })
    expect(validEmail.success).toBe(true)

    const invalidEmail = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      email: 'invalid-email',
    })
    expect(invalidEmail.success).toBe(false)

    const missingEmail = plotInfoFormDTOSchema.safeParse({ ...mockData })
    expect(missingEmail.success).toBe(true)
  })

  it('validates tel correctly', () => {
    const germanTel = '+491522343333'
    const validTel = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      tel: germanTel,
    })
    expect(validTel.success).toBe(true)

    const invalidTel = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      tel: '+1234567890',
    })
    expect(invalidTel.success).toBe(false)

    const invalidTel2 = plotInfoFormDTOSchema.safeParse({
      ...mockData,
      tel: 'invalid-number',
    })
    expect(invalidTel2.success).toBe(false)

    const missingTel = plotInfoFormDTOSchema.safeParse({ ...mockData })
    expect(missingTel.success).toBe(true)
  })
})
