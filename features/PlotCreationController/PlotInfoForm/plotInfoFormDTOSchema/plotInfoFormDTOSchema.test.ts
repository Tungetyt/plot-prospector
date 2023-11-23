import plotInfoFormDTOSchema, {
  PlotInfoFormData
} from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema/plotInfoFormDTOSchema'
import {Writable} from 'type-fest'

const model: Writable<PlotInfoFormData> = {
  description: '',
  address: '',
  price: {value: undefined, currency: 'PLN'},
  email: '',
  tel: '',
  transactionType: [],
  pictures: []
}

let mockedData: typeof model

const schema = plotInfoFormDTOSchema()

describe('plotInfoFormDTOSchema', () => {
  beforeEach(() => {
    mockedData = structuredClone(model)
  })

  it('validates description correctly', () => {
    mockedData.description = 'This is a description'
    const validDescription = schema.safeParse(mockedData)
    expect(validDescription.success).toBe(true)

    mockedData.description = '     '
    const invalidDescription = schema.safeParse(mockedData)
    expect(invalidDescription.success).toBe(true)
  })

  it('validates address correctly', () => {
    mockedData.address = '123 Main St'
    const validAddress = schema.safeParse(mockedData)
    expect(validAddress.success).toBe(true)

    mockedData.address = '    '
    const invalidAddress = schema.safeParse(mockedData)
    expect(invalidAddress.success).toBe(true)
  })

  it('validates price correctly', () => {
    mockedData.price = {value: '20.5', currency: 'USD'}
    const validPrice = schema.safeParse(mockedData)
    expect(validPrice.success).toBe(true)

    mockedData.price = {value: '20.555', currency: 'USD'}
    const invalidPrice = schema.safeParse(mockedData)
    expect(invalidPrice.success).toBe(false)

    mockedData.price = {value: '12345678901234', currency: 'USD'}
    const tooBigValue = schema.safeParse(mockedData)
    expect(tooBigValue.success).toBe(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedData.price = {value: '20.5', currency: 'NonExistentCurrency' as any}
    const badCurrencyValue = schema.safeParse(mockedData)
    expect(badCurrencyValue.success).toBe(false)
  })

  it('validates email correctly', () => {
    mockedData.email = 'test@example.com'
    const validEmail = schema.safeParse(mockedData)
    expect(validEmail.success).toBe(true)

    mockedData.email = 'invalid-email'
    const invalidEmail = schema.safeParse(mockedData)
    expect(invalidEmail.success).toBe(false)
  })

  it('validates tel correctly', () => {
    const germanTel = '+491522343333'
    mockedData.tel = germanTel
    const validTel = schema.safeParse(mockedData)
    expect(validTel.success).toBe(true)

    mockedData.tel = '+1234567890'
    const invalidTel = schema.safeParse(mockedData)
    expect(invalidTel.success).toBe(false)

    mockedData.tel = 'invalid-number'
    const invalidTel2 = schema.safeParse(mockedData)
    expect(invalidTel2.success).toBe(false)
  })

  describe('validates transactionType correctly', () => {
    it('accepts valid transaction types', () => {
      mockedData.transactionType = ['buy', 'sell']
      const validTransactionType = schema.safeParse(mockedData)
      expect(validTransactionType.success).toBe(true)
    })

    it('rejects invalid transaction types', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedData.transactionType = ['invalidType' as any]
      const invalidTransactionType = schema.safeParse(mockedData)
      expect(invalidTransactionType.success).toBe(false)
    })

    it('accepts empty transaction types', () => {
      mockedData.transactionType = []
      const emptyTransactionType = schema.safeParse(mockedData)
      expect(emptyTransactionType.success).toBe(true)
    })
  })
})
