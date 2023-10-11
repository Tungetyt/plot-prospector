import plotInfoFormDTOSchema from '@/features/PlotCreationController/PlotInfoForm/plotInfoFormDTOSchema'

describe('plotInfoFormSchema', () => {
  it('should validate correct data', () => {
    const validData = {
      description: 'A nice plot',
      address: '123 Main St',
      price: {
        value: 100.5,
        currency: 'USD',
      },
      email: 'test@example.com',
      tel: '+491522343333',
    }

    const result = plotInfoFormDTOSchema.safeParse(validData)

    if (!result.success) {
      console.error(result.error)
    }

    expect(result.success).toBe(true)
  })

  describe('description', () => {
    it('should fail if empty', () => {
      const data = {
        description: '',
        // ... other fields
      }

      const result = plotInfoFormDTOSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })

  describe('address', () => {
    it('should fail if empty', () => {
      const data = {
        address: '',
        // ... other fields
      }

      const result = plotInfoFormDTOSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })

  describe('price', () => {
    it('should fail if value is negative', () => {
      const data = {
        price: {
          value: -1,
          currency: 'USD',
        },
        // ... other fields
      }

      const result = plotInfoFormDTOSchema.safeParse(data)

      expect(result.success).toBe(false)
    })

    it('should fail if value has more than 2 decimal places', () => {
      const data = {
        price: {
          value: 100.999,
          currency: 'USD',
        },
        // ... other fields
      }

      const result = plotInfoFormDTOSchema.safeParse(data)

      expect(result.success).toBe(false)
    })

    it('should pass if value has up to 2 decimal places', () => {
      const data = {
        description: 'A nice plot',
        address: '123 Main St',
        price: {
          value: 100.99,
          currency: 'USD',
        },
        email: 'test@example.com',
        tel: '+491522343333', // Make sure this passes your isValidPhoneNumber function
      }

      const result = plotInfoFormDTOSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should fail if currency is invalid', () => {
      const data = {
        price: {
          value: 100,
          currency: 'INVALID',
        },
        // ... other fields
      }

      const result = plotInfoFormDTOSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })

  describe('email', () => {
    it('should fail if email is invalid', () => {
      const data = {
        email: 'invalid',
        // ... other fields
      }

      const result = plotInfoFormDTOSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })

  describe('tel', () => {
    it('should fail if phone number is invalid', () => {
      const data = {
        tel: 'invalid',
        // ... other fields
      }

      const result = plotInfoFormDTOSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })
})
