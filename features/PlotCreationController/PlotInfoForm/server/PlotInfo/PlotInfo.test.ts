import {describe, expect, it} from 'vitest'
import {Data, PlotInfo} from './PlotInfo'

const validData: Data = {
  description: 'A beautiful plot in the countryside',
  address: '123 Country Lane, Countryside',
  price: {
    value: 50000,
    currency: 'USD'
  },
  transactionType: ['buy', 'sell'],
  email: 'owner@example.com',
  tel: '+491522343333',
  pictures: ['data:image/png;base64,...', 'data:image/jpeg;base64,...'],
  draftPlot: [
    {id: '9cadecce-1720-4a55-9fba-e324cfa4faf0', lat: 35.6895, lng: 139.6917},
    {id: 'c8dd93b5-8acd-49c4-b8bc-dbd1875a93a1', lat: 51.5074, lng: -0.1278}
  ]
}

const createInvalidData = () =>
  [
    // Description is too long
    {...validData, description: 'A'.repeat(1001)},

    // Invalid address format
    {...validData, address: ''},

    // Price value is negative
    {...validData, price: {...validData.price, value: -100}},

    // Invalid currency code
    {...validData, price: {...validData.price, currency: 'INVALID'}},

    // Invalid transaction type
    {...validData, transactionType: ['invalidType']},

    // Invalid email format
    {...validData, email: 'invalidEmail'},

    // Invalid telephone number
    {...validData, tel: 'invalidPhone'},

    // Invalid picture format (not a data URL)
    {...validData, pictures: ['invalidPicture']},

    // Invalid latitude and longitude in draftPlot
    {...validData, draftPlot: [{id: 'uuid-3', lat: -91, lng: 181}]}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any

function areArraysDistinct(arr1: string[], arr2: string[]): boolean {
  return !arr1.some(item => arr2.includes(item))
}

describe('PlotInfo Class', () => {
  describe('Constructor', () => {
    it('initializes correctly with valid data', () => {
      // eslint-disable-next-line no-new
      new PlotInfo(validData)
    })

    it('throws an error with invalid data', () => {
      const invalidData = createInvalidData()
      expect(() => new PlotInfo(invalidData)).toThrow()
    })
  })

  describe('Getters', () => {
    const plotInfo = new PlotInfo(validData)

    it('returns the correct description', () => {
      expect(plotInfo.description).toBe(validData.description)
    })
  })

  describe('Validation', () => {
    it('accepts valid data', () => {
      expect(() => new PlotInfo(validData)).not.toThrow()
    })

    it('rejects invalid data', () => {
      const invalidData = createInvalidData()
      expect(() => new PlotInfo(invalidData)).toThrow()
    })

    it('rejects boundary values for price', () => {
      const dataWithBoundaryPrice = {
        ...validData,
        price: {value: 0, currency: 'USD'}
      } as const
      expect(() => new PlotInfo(dataWithBoundaryPrice)).toThrow()
    })

    it('validates boundary values for price', () => {
      const dataWithBoundaryPrice = {
        ...validData,
        price: {value: 0.1, currency: 'USD'}
      } as const
      expect(() => new PlotInfo(dataWithBoundaryPrice)).not.toThrow()
    })

    it('rejects phone number format', () => {
      const dataWithValidPhone = {...validData, tel: '+1234567890'} as const
      expect(() => new PlotInfo(dataWithValidPhone)).toThrow()
    })

    it('validates email format', () => {
      const dataWithValidEmail = {
        ...validData,
        email: 'test@example.com'
      } as const
      expect(() => new PlotInfo(dataWithValidEmail)).not.toThrow()
    })
  })

  describe('DraftPoint ID Generation', () => {
    it('generates unique IDs for each DraftPoint', () => {
      const plotInfo = new PlotInfo(validData)
      const ids = plotInfo.draftPlot.map(dp => dp.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('generates consistent unique IDs on multiple instances', () => {
      const plotInfo1 = new PlotInfo(validData)
      const plotInfo2 = new PlotInfo(validData)
      const ids1 = plotInfo1.draftPlot.map(dp => dp.id)
      const ids2 = plotInfo2.draftPlot.map(dp => dp.id)
      expect(new Set([...ids1, ...ids2]).size).toBe(ids1.length + ids2.length)
    })

    it('generates distinct new IDs for DraftPoint instances compared to original data', () => {
      const originalIds = validData.draftPlot.map(({id}) => id)
      const newIds = new PlotInfo(validData).draftPlot.map(({id}) => id)
      expect(areArraysDistinct(originalIds, newIds)).toBe(true)
    })
  })
})
