import { describe, expect, it } from 'vitest'
import {
  changePointReducer,
  Point,
  PointFromTextInput,
} from './changePointReducer'

describe('changePointReducer', () => {
  describe('isValidPoint', () => {
    it('ok input', () => {
      const okInputs: ReadonlyArray<{
        currentPoint: Point['coords']
        updatedPoint: PointFromTextInput['coords']
        expectedPoint: Point['coords']
      }> = [
        {
          currentPoint: [9, ''],
          updatedPoint: ['90', ''],
          expectedPoint: [90, ''],
        },
        {
          currentPoint: ['', 18],
          updatedPoint: ['', '180'],
          expectedPoint: ['', 180],
        },
        {
          currentPoint: ['', 179],
          updatedPoint: ['', '179.'],
          expectedPoint: ['', 179],
        },
        {
          currentPoint: [90, 18],
          updatedPoint: ['90', '180'],
          expectedPoint: [90, 180],
        },
        {
          currentPoint: [0, ''],
          updatedPoint: ['0', '0'],
          expectedPoint: [0, 0],
        },
        {
          currentPoint: [-9, -180],
          updatedPoint: ['-90', '-180'],
          expectedPoint: [-90, -180],
        },
        {
          currentPoint: [89.12345, 179.123456],
          updatedPoint: ['89.123456', '179.123456'],
          expectedPoint: [89.123456, 179.123456],
        },

        {
          currentPoint: [-89.123456, -179.12345],
          updatedPoint: ['-89.123456', '-179.123456'],
          expectedPoint: [-89.123456, -179.123456],
        },
      ] as const

      const id = 'initial'

      okInputs.forEach(({ currentPoint, updatedPoint, expectedPoint }) => {
        const result = changePointReducer({
          id,
          coords: updatedPoint,
        })({
          plot: [
            {
              id,
              coords: currentPoint,
            },
          ],
        }).plot[0]!.coords
        expect(result).toEqual(expectedPoint)
      })
    })

    it('bad input', () => {
      const badInputs: ReadonlyArray<{
        updatedPoint: PointFromTextInput['coords']
        currentAndExpectedPoint: Point['coords']
      }> = [
        {
          updatedPoint: ['90.', ''],
          currentAndExpectedPoint: [90, ''],
        },
        {
          updatedPoint: ['91', ''],
          currentAndExpectedPoint: [9, ''],
        },
        {
          updatedPoint: ['', '180.'],
          currentAndExpectedPoint: ['', 180],
        },
        {
          updatedPoint: ['', '181'],
          currentAndExpectedPoint: ['', 18],
        },
        {
          updatedPoint: ['-91', ''],
          currentAndExpectedPoint: [-9, ''],
        },
        {
          updatedPoint: ['', '-181'],
          currentAndExpectedPoint: ['', -18],
        },
        {
          updatedPoint: ['45.1234567', ''],
          currentAndExpectedPoint: [45.123456, ''],
        },
        {
          updatedPoint: ['', '-45.1234567'],
          currentAndExpectedPoint: ['', -45.123456],
        },
        {
          updatedPoint: ['45.123.', ''],
          currentAndExpectedPoint: [45.123, ''],
        },
        {
          updatedPoint: ['', '-45.123.'],
          currentAndExpectedPoint: ['', -45.123],
        },
        {
          updatedPoint: ['33 ', ''],
          currentAndExpectedPoint: [33, ''],
        },
        {
          updatedPoint: ['', '49e'],
          currentAndExpectedPoint: ['', 49],
        },
      ] as const

      const id = 'initial'

      badInputs.forEach(({ updatedPoint, currentAndExpectedPoint }) => {
        const result = changePointReducer({
          id,
          coords: updatedPoint,
        })({
          plot: [
            {
              id,
              coords: currentAndExpectedPoint,
            },
          ],
        }).plot[0]!.coords
        expect(result).toEqual(currentAndExpectedPoint)
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
