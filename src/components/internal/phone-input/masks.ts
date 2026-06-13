export interface PhoneMask {
  mask: string
  placeholder: string
  maxLength: number
}

export const phoneMasks: Record<string, PhoneMask> = {
  BR: {
    mask: '(##) #####-####',
    placeholder: '(11) 9 8765-4321',
    maxLength: 11,
  },

  US: {
    mask: '(###) ###-####',
    placeholder: '(555) 123-4567',
    maxLength: 10,
  },
  CA: {
    mask: '(###) ###-####',
    placeholder: '(416) 123-4567',
    maxLength: 10,
  },

  ES: {
    mask: '### ## ## ##',
    placeholder: '612 34 56 78',
    maxLength: 9,
  },

  PT: {
    mask: '### ### ###',
    placeholder: '912 345 678',
    maxLength: 9,
  },

  AR: {
    mask: '## ####-####',
    placeholder: '11 1234-5678',
    maxLength: 10,
  },

  CL: {
    mask: '# #### ####',
    placeholder: '9 1234 5678',
    maxLength: 9,
  },

  MX: {
    mask: '### ### ####',
    placeholder: '555 123 4567',
    maxLength: 10,
  },

  CO: {
    mask: '### ### ####',
    placeholder: '300 123 4567',
    maxLength: 10,
  },

  PE: {
    mask: '### ### ###',
    placeholder: '987 654 321',
    maxLength: 9,
  },
}

export const applyPhoneMask = (value: string, mask: string): string => {
  if (!value || !mask) return value

  const numbers = value.replace(/\D/g, '')

  let maskedValue = ''
  let numberIndex = 0

  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === '#') {
      maskedValue += numbers[numberIndex]
      numberIndex++
    } else {
      maskedValue += mask[i]
    }
  }

  return maskedValue
}

export const removePhoneMask = (value: string | null | undefined): string => {
  if (!value || typeof value !== 'string') return ''
  return value.replace(/\D/g, '')
}

export const isPhoneComplete = (
  value: string,
  countryCode: string,
): boolean => {
  const mask = phoneMasks[countryCode]
  if (!mask) return value.length >= 7

  const numbersOnly = removePhoneMask(value)
  return numbersOnly.length >= mask.maxLength
}

export const getDefaultMask = (): PhoneMask => ({
  mask: '###############',
  placeholder: '123456789',
  maxLength: 15,
})
