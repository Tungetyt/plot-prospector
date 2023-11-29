'use server'

import {ZodError} from 'zod'
import {
  Data,
  PlotInfo
} from '@/features/PlotCreationController/PlotInfoForm/server/PlotInfo/PlotInfo'

const plotInfoAction = async (data: Data) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const plotInfo = new PlotInfo(data)

    return 201
  } catch (err) {
    if (err instanceof ZodError) return 400
    return 500
  }
}

export default plotInfoAction
