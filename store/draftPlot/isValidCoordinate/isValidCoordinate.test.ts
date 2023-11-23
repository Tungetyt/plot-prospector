import isValidCoordinate from '@/store/draftPlot/isValidCoordinate/isValidCoordinate'

describe('isValidCoordinate', () => {
  const latLngTests = [
    {value: '123.1234567', type: 'lat', result: false},
    {value: '123.123456', type: 'lng', result: true},
    {value: '0.123456', type: 'lat', result: true},
    {value: '90', type: 'lat', result: true},
    {value: '90.', type: 'lat', result: false},
    {value: '90.0', type: 'lat', result: true},
    {value: '90.1', type: 'lat', result: false},
    {value: '-90', type: 'lat', result: true},
    {value: '91', type: 'lat', result: false},
    {value: '-91', type: 'lat', result: false},
    {value: '180', type: 'lng', result: true},
    {value: '180.', type: 'lng', result: false},
    {value: '180.0', type: 'lng', result: true},
    {value: '180.1', type: 'lng', result: false},
    {value: '-180', type: 'lng', result: true},
    {value: '181', type: 'lng', result: false},
    {value: '-181', type: 'lng', result: false},
    {value: '-', type: 'lng', result: true},
    {value: '1-', type: 'lng', result: false},
    {value: '-1', type: 'lng', result: true},
    {value: '-1.1', type: 'lng', result: true},
    {value: '-.1', type: 'lng', result: true},
    {value: '0.1', type: 'lng', result: true},
    {value: '01', type: 'lng', result: false},
    {value: '00.1', type: 'lng', result: false},
    {value: 'NaN', type: 'lng', result: false},
    {value: 'abc', type: 'lng', result: false},
    {value: '123.123.', type: 'lng', result: false},
    {value: '123..123', type: 'lng', result: false},
    {value: '123-.123', type: 'lng', result: false},
    {value: '123.-123', type: 'lng', result: false}
  ] as const

  latLngTests.forEach(({value, type, result}) => {
    it(`Checks value: ${value} for ${type}`, () => {
      expect(isValidCoordinate(value, type)).toEqual(result)
    })
  })
})
