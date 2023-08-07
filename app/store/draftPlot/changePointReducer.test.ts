import { describe, expect, it } from 'vitest'
import {
  changePointReducer,
  Point,
  PointFromTextInput,
} from './changePointReducer'

describe('changePointReducer', () => {
  describe('isValidPoint', () => {
    const okInputs: ReadonlyArray<{
      currentPoint: Pick<Point, 'lat' | 'lng'>
      updatedPoint: Pick<PointFromTextInput, 'lat' | 'lng'>
      expectedPoint: Pick<Point, 'lat' | 'lng'>
    }> = [
      {
        currentPoint: { lat: 9, lng: '' },
        updatedPoint: { lat: '90', lng: '' },
        expectedPoint: { lat: 90, lng: '' },
      },
      {
        currentPoint: { lat: '', lng: 18 },
        updatedPoint: { lat: '', lng: '180' },
        expectedPoint: { lat: '', lng: 180 },
      },
      {
        currentPoint: { lat: 90, lng: 18 },
        updatedPoint: { lat: '90', lng: '180' },
        expectedPoint: { lat: 90, lng: 180 },
      },
      {
        currentPoint: { lat: 0, lng: '' },
        updatedPoint: { lat: '0', lng: '0' },
        expectedPoint: { lat: 0, lng: 0 },
      },
      {
        currentPoint: { lat: -9, lng: -180 },
        updatedPoint: { lat: '-90', lng: '-180' },
        expectedPoint: { lat: -90, lng: -180 },
      },
      {
        currentPoint: { lat: 89.12345, lng: 179.123456 },
        updatedPoint: { lat: '89.123456', lng: '179.123456' },
        expectedPoint: { lat: 89.123456, lng: 179.123456 },
      },
      {
        currentPoint: { lat: -89.123456, lng: -179.12345 },
        updatedPoint: { lat: '-89.123456', lng: '-179.123456' },
        expectedPoint: { lat: -89.123456, lng: -179.123456 },
      },
      {
        currentPoint: { lat: 89, lng: '' },
        updatedPoint: { lat: '89.', lng: '' },
        expectedPoint: { lat: '89.', lng: '' },
      },
      {
        currentPoint: { lat: '', lng: 179 },
        updatedPoint: { lat: '', lng: '179.' },
        expectedPoint: { lat: '', lng: '179.' },
      },
      {
        currentPoint: { lat: '', lng: 179 },
        updatedPoint: { lat: '', lng: '-179.123456' },
        expectedPoint: { lat: '', lng: -179.123456 },
      },
      {
        currentPoint: { lat: '', lng: 179 },
        updatedPoint: { lat: '', lng: '-0' },
        expectedPoint: { lat: '', lng: -0 },
      },
    ] as const

    okInputs.forEach(({ currentPoint, updatedPoint, expectedPoint }) => {
      it(`ok input ${JSON.stringify(updatedPoint)}`, () => {
        const id = 'initial'

        const { lng, lat } = changePointReducer({
          id,
          lat: updatedPoint.lat,
          lng: updatedPoint.lng,
        })({
          plot: [
            {
              id,
              lat: currentPoint.lat,
              lng: currentPoint.lng,
            },
          ],
        }).plot[0]!

        expect({ lng, lat }).toEqual(expectedPoint)
      })
    })

    it('bad input', () => {
      const badInputs: ReadonlyArray<{
        updatedPoint: Pick<PointFromTextInput, 'lat' | 'lng'>
        currentAndExpectedPoint: Pick<Point, 'lat' | 'lng'>
      }> = [
        {
          updatedPoint: { lat: '90.', lng: '' },
          currentAndExpectedPoint: { lat: 90, lng: '' },
        },
        {
          updatedPoint: { lat: '91', lng: '' },
          currentAndExpectedPoint: { lat: 9, lng: '' },
        },
        {
          updatedPoint: { lat: '', lng: '180.' },
          currentAndExpectedPoint: { lat: '', lng: 180 },
        },
        {
          updatedPoint: { lat: '', lng: '181' },
          currentAndExpectedPoint: { lat: '', lng: 18 },
        },
        {
          updatedPoint: { lat: '-91', lng: '' },
          currentAndExpectedPoint: { lat: -9, lng: '' },
        },
        {
          updatedPoint: { lat: '', lng: '-181' },
          currentAndExpectedPoint: { lat: '', lng: -18 },
        },
        {
          updatedPoint: { lat: '45.1234567', lng: '' },
          currentAndExpectedPoint: { lat: 45.123456, lng: '' },
        },
        {
          updatedPoint: { lat: '', lng: '-45.1234567' },
          currentAndExpectedPoint: { lat: '', lng: -45.123456 },
        },
        {
          updatedPoint: { lat: '45.123.', lng: '' },
          currentAndExpectedPoint: { lat: 45.123, lng: '' },
        },
        {
          updatedPoint: { lat: '', lng: '-45.123.' },
          currentAndExpectedPoint: { lat: '', lng: -45.123 },
        },
        {
          updatedPoint: { lat: '33 ', lng: '' },
          currentAndExpectedPoint: { lat: 33, lng: '' },
        },
        {
          updatedPoint: { lat: '', lng: '49e' },
          currentAndExpectedPoint: { lat: '', lng: 49 },
        },
        {
          updatedPoint: { lat: '9abc9def9', lng: '' },
          currentAndExpectedPoint: { lat: '', lng: '' },
        },
      ] as const

      const id = 'initial'

      badInputs.forEach(({ updatedPoint, currentAndExpectedPoint }) => {
        const { lng, lat } = changePointReducer({
          id,
          lat: updatedPoint.lat,
          lng: updatedPoint.lng,
        })({
          plot: [
            {
              id,
              lat: currentAndExpectedPoint.lat,
              lng: currentAndExpectedPoint.lng,
            },
          ],
        }).plot[0]!
        expect({ lng, lat }).toEqual(currentAndExpectedPoint)
      })
    })

    describe.todo('adding points', () => {
      // const okInputs: ReadonlyArray<{
      //     currentPlot: ReadonlyArray<Point>
      //     updatedPoint: Point
      //     expectedPlot: ReadonlyArray<Point>
      // }> = [
      //     {
      //         currentPlot: [[9, '']],
      //         updatedPoint: ['90', ''],
      //         expectedPlot: [90, ''],
      //     },
      // ] as const
      //
      // const id = 'initial'
      //
      // okInputs.forEach(({ currentPlot, updatedPoint, expectedPlot }) => {
      //     const result = changePointReducer({
      //         id,
      //         point: updatedPoint,
      //     })({
      //         plot: [
      //             {
      //                 id,
      //                 point: currentPlot,
      //             },
      //         ],
      //     }).plot[0]!.point
      //     expect(result).toEqual(expectedPlot)
      // })
    })

    describe.todo('removing points', () => {})
  })
})
