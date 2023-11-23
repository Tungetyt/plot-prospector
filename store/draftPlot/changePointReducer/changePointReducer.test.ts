import {Point, PointFromTextInput} from '@/store/draftPlot/common'
import changePointReducer from '@/store/draftPlot/changePointReducer/changePointReducer'

describe('changePointReducer', () => {
  const okInputs: ReadonlyArray<{
    currentPoint: Pick<Point, 'lat' | 'lng'>
    updatedPoint: Pick<PointFromTextInput, 'lat' | 'lng'>
    expectedPoint: Pick<Point, 'lat' | 'lng'>
  }> = [
    {
      currentPoint: {lat: 9, lng: ''},
      updatedPoint: {lat: '90', lng: ''},
      expectedPoint: {lat: 90, lng: ''}
    },
    {
      currentPoint: {lat: '', lng: 18},
      updatedPoint: {lat: '', lng: '180'},
      expectedPoint: {lat: '', lng: 180}
    },
    {
      currentPoint: {lat: 90, lng: 18},
      updatedPoint: {lat: '90', lng: '180'},
      expectedPoint: {lat: 90, lng: 180}
    },
    {
      currentPoint: {lat: 0, lng: ''},
      updatedPoint: {lat: '0', lng: '0'},
      expectedPoint: {lat: 0, lng: 0}
    },
    {
      currentPoint: {lat: -9, lng: -180},
      updatedPoint: {lat: '-90', lng: '-180'},
      expectedPoint: {lat: -90, lng: -180}
    },
    {
      currentPoint: {lat: 89.12345, lng: 179.123456},
      updatedPoint: {lat: '89.123456', lng: '179.123456'},
      expectedPoint: {lat: 89.123456, lng: 179.123456}
    },
    {
      currentPoint: {lat: -89.123456, lng: -179.12345},
      updatedPoint: {lat: '-89.123456', lng: '-179.123456'},
      expectedPoint: {lat: -89.123456, lng: -179.123456}
    },
    {
      currentPoint: {lat: 89, lng: ''},
      updatedPoint: {lat: '89.', lng: ''},
      expectedPoint: {lat: '89.', lng: ''}
    },
    {
      currentPoint: {lat: '50.', lng: ''},
      updatedPoint: {lat: '50.0', lng: ''},
      expectedPoint: {lat: '50.0', lng: ''}
    },
    {
      currentPoint: {lat: '50.0', lng: ''},
      updatedPoint: {lat: '50.00', lng: ''},
      expectedPoint: {lat: '50.00', lng: ''}
    },
    {
      currentPoint: {lat: 52.23, lng: ''},
      updatedPoint: {lat: '52.230', lng: ''},
      expectedPoint: {lat: '52.230', lng: ''}
    },
    {
      currentPoint: {lat: '52.230', lng: ''},
      updatedPoint: {lat: '52.2300', lng: ''},
      expectedPoint: {lat: '52.2300', lng: ''}
    },
    {
      currentPoint: {lat: '50.0', lng: ''},
      updatedPoint: {lat: '50.06', lng: ''},
      expectedPoint: {lat: 50.06, lng: ''}
    },
    {
      currentPoint: {lat: '', lng: 179},
      updatedPoint: {lat: '', lng: '179.'},
      expectedPoint: {lat: '', lng: '179.'}
    },
    {
      currentPoint: {lat: '', lng: 179},
      updatedPoint: {lat: '', lng: '-179.123456'},
      expectedPoint: {lat: '', lng: -179.123456}
    },
    {
      currentPoint: {lat: '', lng: 179},
      updatedPoint: {lat: '', lng: '-0'},
      expectedPoint: {lat: '', lng: -0}
    },
    {
      currentPoint: {lat: '', lng: ''},
      updatedPoint: {lat: '', lng: '52.123456789101112'},
      expectedPoint: {lat: '', lng: 52.123456}
    },
    {
      currentPoint: {lat: '', lng: ''},
      updatedPoint: {lat: '', lng: '52.000000000000000000'},
      expectedPoint: {lat: '', lng: '52.000000'}
    },
    {
      currentPoint: {lat: '', lng: ''},
      updatedPoint: {lat: '', lng: ''},
      expectedPoint: {lat: '', lng: ''}
    },
    {
      currentPoint: {lat: '', lng: ''},
      updatedPoint: {lat: '\n\t   - 8 0 \t\n   . 32 \t\n', lng: ''},
      expectedPoint: {lat: -80.32, lng: ''}
    }
  ] as const

  okInputs.forEach(({currentPoint, updatedPoint, expectedPoint}) => {
    it(`ok input ${JSON.stringify(updatedPoint)}`, () => {
      const id = 'initial'

      const {lng, lat} = changePointReducer({
        id,
        lat: updatedPoint.lat,
        lng: updatedPoint.lng
      })({
        plot: [
          {
            id,
            lat: currentPoint.lat,
            lng: currentPoint.lng
          }
        ],
        phase: ''
      }).plot[0]!

      expect({lng, lat}).toEqual(expectedPoint)
    })
  })

  const badInputs: ReadonlyArray<{
    updatedPoint: Pick<PointFromTextInput, 'lat' | 'lng'>
    currentAndExpectedPoint: Pick<Point, 'lat' | 'lng'>
  }> = [
    {
      updatedPoint: {lat: '90.', lng: ''},
      currentAndExpectedPoint: {lat: 90, lng: ''}
    },
    {
      updatedPoint: {lat: '91', lng: ''},
      currentAndExpectedPoint: {lat: 9, lng: ''}
    },
    {
      updatedPoint: {lat: '', lng: '180.'},
      currentAndExpectedPoint: {lat: '', lng: 180}
    },
    {
      updatedPoint: {lat: '', lng: '181'},
      currentAndExpectedPoint: {lat: '', lng: 18}
    },
    {
      updatedPoint: {lat: '-91', lng: ''},
      currentAndExpectedPoint: {lat: -9, lng: ''}
    },
    {
      updatedPoint: {lat: '', lng: '-181'},
      currentAndExpectedPoint: {lat: '', lng: -18}
    },
    {
      updatedPoint: {lat: '45.1234567', lng: ''},
      currentAndExpectedPoint: {lat: 45.123456, lng: ''}
    },
    {
      updatedPoint: {lat: '', lng: '-45.1234567'},
      currentAndExpectedPoint: {lat: '', lng: -45.123456}
    },
    {
      updatedPoint: {lat: '45.123.', lng: ''},
      currentAndExpectedPoint: {lat: 45.123, lng: ''}
    },
    {
      updatedPoint: {lat: '', lng: '-45.123.'},
      currentAndExpectedPoint: {lat: '', lng: -45.123}
    },
    {
      updatedPoint: {lat: '33 ', lng: ''},
      currentAndExpectedPoint: {lat: 33, lng: ''}
    },
    {
      updatedPoint: {lat: '', lng: '49e'},
      currentAndExpectedPoint: {lat: '', lng: 49}
    },
    {
      updatedPoint: {lat: '9abc9def9', lng: ''},
      currentAndExpectedPoint: {lat: '', lng: ''}
    }
  ] as const

  const id = 'initial'

  badInputs.forEach(({updatedPoint, currentAndExpectedPoint}) => {
    it(`bad input ${JSON.stringify(updatedPoint)}`, () => {
      const {lng, lat} = changePointReducer({
        id,
        lat: updatedPoint.lat,
        lng: updatedPoint.lng
      })({
        plot: [
          {
            id,
            lat: currentAndExpectedPoint.lat,
            lng: currentAndExpectedPoint.lng
          }
        ],
        phase: ''
      }).plot[0]!

      expect({lng, lat}).toEqual(currentAndExpectedPoint)
    })
  })

  describe('Adding and removing points', () => {
    const validAddPointsInputs: ReadonlyArray<{
      currentPlot: ReadonlyArray<Point>
      updatedPoint: PointFromTextInput
      expectedPlot: ReadonlyArray<Point>
    }> = [
      {
        currentPlot: [{id: 'a', lat: '', lng: ''}],
        updatedPoint: {id: 'a', lat: '1', lng: ''},
        expectedPlot: [{id: 'a', lat: 1, lng: ''}]
      },
      {
        currentPlot: [{id: 'a', lat: 1, lng: ''}],
        updatedPoint: {id: 'a', lat: 1, lng: '2'},
        expectedPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: expect.any(String), lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: 'b', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'b', lat: '3', lng: ''},
        expectedPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: 'b', lat: 3, lng: ''}
        ]
      },
      // A start
      {
        currentPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: 'b', lat: 3, lng: ''}
        ],
        updatedPoint: {id: 'b', lat: '', lng: ''},
        expectedPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: 'b', lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: 'b', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'a', lat: '', lng: 2},
        expectedPlot: [{id: 'a', lat: '', lng: 2}]
      },
      {
        currentPlot: [{id: 'a', lat: '', lng: 2}],
        updatedPoint: {id: 'a', lat: '', lng: ''},
        expectedPlot: [{id: 'a', lat: '', lng: ''}]
      },
      // A stop
      {
        currentPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: 'b', lat: 3, lng: ''}
        ],
        updatedPoint: {id: 'b', lat: 3, lng: '4'},
        expectedPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: 'b', lat: 3, lng: 4},
          {id: expect.any(String), lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: 1, lng: 2},
          {id: 'b', lat: 3, lng: 4},
          {id: 'c', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'a', lat: 1, lng: ''},
        expectedPlot: [
          {id: 'a', lat: 1, lng: ''},
          {id: 'b', lat: 3, lng: 4},
          {id: 'c', lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: 1, lng: ''},
          {id: 'b', lat: 3, lng: 4},
          {id: 'c', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'a', lat: '', lng: ''},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: 3, lng: 4},
          {id: 'c', lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: 3, lng: 4},
          {id: 'c', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'b', lat: '3.', lng: 4},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: '3.', lng: 4}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: '3.', lng: 4}
        ],
        updatedPoint: {id: 'b', lat: '3.8', lng: 4},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: 3.8, lng: 4},
          {id: expect.any(String), lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: 3.8, lng: 4},
          {id: 'c', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'b', lat: '-3.8', lng: 4},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'c', lat: '5', lng: ''},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: 5, lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: 5, lng: ''}
        ],
        updatedPoint: {id: 'c', lat: 5, lng: '-'},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: 5, lng: '-'}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: 5, lng: '-'}
        ],
        updatedPoint: {id: 'c', lat: 5, lng: '-6'},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: 5, lng: -6},
          {id: expect.any(String), lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: 5, lng: -6},
          {id: 'd', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'c', lat: 5, lng: '6'},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: 5, lng: 6},
          {id: 'd', lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: -3.8, lng: 4},
          {id: 'c', lat: 5, lng: 6},
          {id: 'd', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'b', lat: '', lng: 4},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: '', lng: 4},
          {id: 'c', lat: 5, lng: 6},
          {id: 'd', lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: '', lng: 4},
          {id: 'c', lat: 5, lng: 6},
          {id: 'd', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'b', lat: '', lng: ''},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: '', lng: ''},
          {id: 'c', lat: 5, lng: 6},
          {id: 'd', lat: '', lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: '', lng: ''},
          {id: 'c', lat: 5, lng: 6},
          {id: 'd', lat: '', lng: ''}
        ],
        updatedPoint: {id: 'c', lat: '5', lng: ''},
        expectedPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: '', lng: ''},
          {id: 'c', lat: 5, lng: ''}
        ]
      },
      {
        currentPlot: [
          {id: 'a', lat: '', lng: ''},
          {id: 'b', lat: '', lng: ''},
          {id: 'c', lat: 5, lng: ''}
        ],
        updatedPoint: {id: 'c', lat: '', lng: ''},
        expectedPlot: [{id: 'a', lat: '', lng: ''}]
      }
    ] as const

    validAddPointsInputs.forEach(
      ({currentPlot, updatedPoint, expectedPlot}) => {
        it(`Point adding and removing ${JSON.stringify(updatedPoint)}`, () => {
          const {plot} = changePointReducer(updatedPoint)({
            plot: currentPlot,
            phase: ''
          })

          expect(plot).toEqual(expectedPlot)
        })
      }
    )
  })
})
