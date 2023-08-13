import isNumeric from '@/utils/common'

const isValidCoordinate = (
  value: string | number,
  type: 'lat' | 'lng',
): boolean => {
  const stringValue = isNumeric(value) ? value.toString() : value

  // Special check for standalone minus sign
  if (stringValue === '-') return true

  // Check for any characters other than numbers, dot, and minus sign
  if (/[^0-9.-]/.test(stringValue)) return false

  // Check for multiple dots or minus signs
  if ((stringValue.match(/\./g) || []).length > 1) return false
  if ((stringValue.match(/-/g) || []).length > 1) return false

  // Ensure minus is at the start if it exists
  if (stringValue.includes('-') && stringValue.indexOf('-') !== 0) return false

  // Ensure no leading zeros unless the value is '0' or a fraction < 1 (e.g., '0.123')
  if (/^0[0-9]+/.test(stringValue)) return false

  // Precision Control: Ensure no more than 6 decimal places
  if ((stringValue.split('.')[1] || '').length > 6) return false

  // Convert back to number for range checks
  const numValue = Number(stringValue)

  // Ensure it's a valid number
  if (Number.isNaN(numValue)) return false

  // Special checks for exact 90 or 180
  if (numValue === 90 && type === 'lat' && stringValue.endsWith('.'))
    return false
  if (numValue === 180 && type === 'lng' && stringValue.endsWith('.'))
    return false

  // Range Restrictions
  if (type === 'lng' && (numValue < -180 || numValue > 180)) return false
  if (type === 'lat' && (numValue < -90 || numValue > 90)) return false

  return true
}

export default isValidCoordinate
