import {ImageListType, ImageType} from 'react-images-uploading'
import {z} from 'zod'

type DataURLKey = keyof Pick<ImageType, 'dataURL'>
type ExistingImageType = Omit<ImageType, 'dataURL'> & Record<DataURLKey, string>
export type ExistingImageListType = Array<ExistingImageType>
export const removeDuplicateImages = (
  imageList: ImageListType
): ExistingImageListType => {
  const uniqueDataURLs = new Set<string>()

  const filteredList: ExistingImageListType = []

  imageList.forEach(image => {
    const isValid = z.string().safeParse(image.dataURL)

    if (isValid.success) {
      const {data} = isValid

      if (!uniqueDataURLs.has(data)) {
        uniqueDataURLs.add(data)

        const existingImage: ExistingImageType = {
          ...image,
          dataURL: data
        }

        filteredList.push(existingImage)
      }
    }
  })

  return filteredList
}
