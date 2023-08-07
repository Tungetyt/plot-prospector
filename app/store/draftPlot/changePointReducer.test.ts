import { describe, expect, it } from 'vitest'
import {
  changePointReducer,
  Point,
  PointFromTextInput,
} from './changePointReducer'

describe('changePointReducer', () => {
  describe('isValidPoint', () => {
    const okInputs: ReadonlyArray<{
      currentPoint: Pick<Point, 'x' | 'y'>
      updatedPoint: Pick<PointFromTextInput, 'x' | 'y'>
      expectedPoint: Pick<Point, 'x' | 'y'>
    }> = [
      {
        currentPoint: { x: 9, y: '' },
        updatedPoint: { x: '90', y: '' },
        expectedPoint: { x: 90, y: '' },
      },
      {
        currentPoint: { x: '', y: 18 },
        updatedPoint: { x: '', y: '180' },
        expectedPoint: { x: '', y: 180 },
      },
      {
        currentPoint: { x: 90, y: 18 },
        updatedPoint: { x: '90', y: '180' },
        expectedPoint: { x: 90, y: 180 },
      },
      {
        currentPoint: { x: 0, y: '' },
        updatedPoint: { x: '0', y: '0' },
        expectedPoint: { x: 0, y: 0 },
      },
      {
        currentPoint: { x: -9, y: -180 },
        updatedPoint: { x: '-90', y: '-180' },
        expectedPoint: { x: -90, y: -180 },
      },
      {
        currentPoint: { x: 89.12345, y: 179.123456 },
        updatedPoint: { x: '89.123456', y: '179.123456' },
        expectedPoint: { x: 89.123456, y: 179.123456 },
      },
      {
        currentPoint: { x: -89.123456, y: -179.12345 },
        updatedPoint: { x: '-89.123456', y: '-179.123456' },
        expectedPoint: { x: -89.123456, y: -179.123456 },
      },
      {
        currentPoint: { x: 89, y: '' },
        updatedPoint: { x: '89.', y: '' },
        expectedPoint: { x: '89.', y: '' },
      },
      {
        currentPoint: { x: '', y: 179 },
        updatedPoint: { x: '', y: '179.' },
        expectedPoint: { x: '', y: '179.' },
      },
    ] as const

    okInputs.forEach(({ currentPoint, updatedPoint, expectedPoint }) => {
      it(`ok input ${JSON.stringify(updatedPoint)}`, () => {
        const id = 'initial'

        const { x, y } = changePointReducer({
          id,
          x: updatedPoint.x,
          y: updatedPoint.y,
        })({
          plot: [
            {
              id,
              x: currentPoint.x,
              y: currentPoint.y,
            },
          ],
        }).plot[0]!

        expect({ x, y }).toEqual(expectedPoint)
      })
    })

    it('bad input', () => {
      const badInputs: ReadonlyArray<{
        updatedPoint: Pick<PointFromTextInput, 'x' | 'y'>
        currentAndExpectedPoint: Pick<Point, 'x' | 'y'>
      }> = [
        {
          updatedPoint: { x: '90.', y: '' },
          currentAndExpectedPoint: { x: 90, y: '' },
        },
        {
          updatedPoint: { x: '91', y: '' },
          currentAndExpectedPoint: { x: 9, y: '' },
        },
        {
          updatedPoint: { x: '', y: '180.' },
          currentAndExpectedPoint: { x: '', y: 180 },
        },
        {
          updatedPoint: { x: '', y: '181' },
          currentAndExpectedPoint: { x: '', y: 18 },
        },
        {
          updatedPoint: { x: '-91', y: '' },
          currentAndExpectedPoint: { x: -9, y: '' },
        },
        {
          updatedPoint: { x: '', y: '-181' },
          currentAndExpectedPoint: { x: '', y: -18 },
        },
        {
          updatedPoint: { x: '45.1234567', y: '' },
          currentAndExpectedPoint: { x: 45.123456, y: '' },
        },
        {
          updatedPoint: { x: '', y: '-45.1234567' },
          currentAndExpectedPoint: { x: '', y: -45.123456 },
        },
        {
          updatedPoint: { x: '45.123.', y: '' },
          currentAndExpectedPoint: { x: 45.123, y: '' },
        },
        {
          updatedPoint: { x: '', y: '-45.123.' },
          currentAndExpectedPoint: { x: '', y: -45.123 },
        },
        {
          updatedPoint: { x: '33 ', y: '' },
          currentAndExpectedPoint: { x: 33, y: '' },
        },
        {
          updatedPoint: { x: '', y: '49e' },
          currentAndExpectedPoint: { x: '', y: 49 },
        },
      ] as const

      const id = 'initial'

      badInputs.forEach(({ updatedPoint, currentAndExpectedPoint }) => {
        const { x, y } = changePointReducer({
          id,
          x: updatedPoint.x,
          y: updatedPoint.y,
        })({
          plot: [
            {
              id,
              x: currentAndExpectedPoint.x,
              y: currentAndExpectedPoint.y,
            },
          ],
        }).plot[0]!
        expect({ x, y }).toEqual(currentAndExpectedPoint)
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
