const isNumeric = (input: number | string): input is number =>
  typeof input === 'number'

export default isNumeric
