import {ImageListType, ImageType} from 'react-images-uploading'
import {z} from 'zod'

import {removeDuplicateImages} from '@/features/PlotCreationController/PlotInfoForm/removeDuplicateImages/removeDuplicateImages'

const createMockImage = (
  dataURL: ImageType['dataURL'],
  id: number
): ImageType => ({
  file: new File([''], `filename${id}.png`, {type: 'image/png'}),
  ...(dataURL !== undefined && {dataURL})
})

describe('removeDuplicateImages', () => {
  it('should return all images if there are no duplicates', () => {
    const imageList: ImageListType = [
      createMockImage('data:image/png;base64,unique1', 1),
      createMockImage('data:image/png;base64,unique2', 2)
    ]
    const result = removeDuplicateImages(imageList)
    expect(result).toHaveLength(imageList.length)
  })

  it('should filter out duplicate images', () => {
    const imageList: ImageListType = [
      createMockImage('data:image/png;base64,same', 1),
      createMockImage('data:image/png;base64,same', 2),
      createMockImage('data:image/png;base64,unique', 3)
    ]
    const result = removeDuplicateImages(imageList)
    expect(result).toHaveLength(2)
    expect(
      result.find(img => img.dataURL === 'data:image/png;base64,same')
    ).toBeTruthy()
    expect(
      result.find(img => img.dataURL === 'data:image/png;base64,unique')
    ).toBeTruthy()
  })

  it('should only contain images with valid dataURLs', () => {
    const imageList: ImageListType = [
      createMockImage('data:image/png;base64,valid1', 1),
      createMockImage(undefined, 2),
      createMockImage('data:image/png;base64,valid2', 3)
    ]
    const result = removeDuplicateImages(imageList)
    expect(result).toHaveLength(2)
    expect(z.string().safeParse(result[0]!.dataURL).success).toBeTruthy()
    expect(z.string().safeParse(result[1]!.dataURL).success).toBeTruthy()
  })

  it('should maintain all other properties of the images', () => {
    const dataURL = 'data:image/png;base64,preserveProps'
    const imageList: ImageListType = [createMockImage(dataURL, 1)]
    const result = removeDuplicateImages(imageList)
    expect(result[0]).toHaveProperty('file')
  })

  it('should return an empty array ', () => {
    const result = removeDuplicateImages([])
    expect(result).toHaveLength(0)
  })
})
